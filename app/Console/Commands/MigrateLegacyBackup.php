<?php

namespace App\Console\Commands;

use App\Models\MediaLibraryItem;
use App\Models\Order;
use App\Models\User;
use App\Services\MediaLibraryRegistrar;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Syncs the records that exist in the production backup but not yet here.
 *
 * This database was seeded from an earlier export, and trading carried on in the
 * old system afterwards: 243 counter sales, their line items, the customers who
 * placed them, three new saris and the messages customers sent in. This brings
 * those across.
 *
 * Two rules govern everything below.
 *
 * **Insert only, never update.** Rows already here have since been edited on
 * purpose — seven products repriced, seven recategorised, a slug corrected, a
 * coupon extended. Copying the backup over them would silently undo those
 * decisions, so an existing row is left alone. The one exception is narrow and
 * deliberate: an order pointed at a customer who had to be renumbered is moved
 * to wherever that customer actually landed, because otherwise it names the
 * wrong person.
 *
 * **Ids are kept where they can be, remapped where they cannot.** For most rows
 * the two databases agree, and keeping the id means orders still point at the
 * right customer and line items at the right order for free. But both systems
 * kept issuing ids after the seed, so some now disagree: id 711 is a real
 * customer in the backup and the developer's own login here. Matching on id
 * alone would drop those records silently — which is exactly how six counter
 * sales, two customers, five line items and two baskets went missing on the
 * first attempt. So every table is matched on what its rows *say* rather than
 * on their id, and a row whose id is taken is inserted under a new one with its
 * dependants pointed at it.
 *
 * Both rules together make the command idempotent: a second run finds every
 * record already present, under whatever id it ended up with, and does nothing.
 */
class MigrateLegacyBackup extends Command
{
    protected $signature = 'migrate:legacy-backup
        {--source=charukothon_src : Database holding the restored production dump}
        {--files= : public/ directory of the old admin panel, for image files}
        {--fresh : Clear the business tables first and reimport the backup wholesale}
        {--all-media : Copy every media file in the backup, not only the referenced ones}
        {--dry-run : Report what would change without writing}';

    protected $description = 'Import records present in the production backup but missing from this database';

    /** Old absolute image URLs are rewritten onto this prefix, keeping their folder. */
    private const LEGACY_HOST_PATH = 'storage';

    private const CUSTOMER_ROLE = 'Customer';

    private bool $dryRun = false;

    private string $source;

    /** @var array<string, int> */
    private array $summary = [];

    /**
     * Legacy id => id in this database, for rows that could not keep their own.
     *
     * @var array<int, int>
     */
    private array $userIdMap = [];

    /** @var array<int, int> */
    private array $orderIdMap = [];

    /** Keeps ids invented during a dry run from colliding with each other. */
    private int $pretendInserts = 0;

    /** email => role ids held before a --fresh wipe, restored afterwards. */
    private array $staffRoles = [];

    /** Paths copied by --all-media, which the folder scan would not find. */
    private array $pendingRegistration = [];

    /** table => rows handed to insertOrIgnore that did not land. */
    private array $dropped = [];

    public function handle(): int
    {
        $this->dryRun = (bool) $this->option('dry-run');
        $this->source = $this->option('source');

        $this->configureSourceConnection();

        try {
            DB::connection('legacy')->getPdo();
        } catch (\Throwable $e) {
            $this->error("Cannot reach source database [{$this->source}]: {$e->getMessage()}");

            return self::FAILURE;
        }

        if ($this->dryRun) {
            $this->warn('DRY RUN — no rows will be written.');
        }

        if ($this->option('fresh')) {
            $this->clearBusinessTables();
        }

        // Order matters: every table below depends on the ones above it.
        $this->importCategories();
        $this->importProducts();
        $this->importUsers();
        $this->restoreStaffRoles();
        $this->assignCustomerRoles();
        $this->importOrders();
        $this->importOrderItems();
        $this->importCarts();
        $this->importSimpleTables();

        if ($this->option('all-media')) {
            $this->copyAllBackupMedia();
        }

        $this->registerMedia();

        $this->newLine();
        $this->info('Summary');
        foreach ($this->summary as $label => $count) {
            $this->line(sprintf('  %-34s %d', $label, $count));
        }

        if ($this->dropped !== []) {
            $this->newLine();
            $this->error('Rows were silently rejected — this needs looking at:');
            foreach ($this->dropped as $table => $count) {
                $this->line(sprintf('  %-34s %d row(s) did not land', $table, $count));
            }

            return self::FAILURE;
        }

        return self::SUCCESS;
    }

    private function configureSourceConnection(): void
    {
        Config::set('database.connections.legacy', array_merge(
            config('database.connections.mysql'),
            ['database' => $this->source]
        ));
    }

    /**
     * Column names shared by both schemas.
     *
     * Anything the new schema dropped (products.brand_id, products.subcategory_id)
     * falls out here, and anything it added keeps its default.
     *
     * @return list<string>
     */
    private function sharedColumns(string $table): array
    {
        return array_values(array_intersect(
            DB::connection('legacy')->getSchemaBuilder()->getColumnListing($table),
            DB::getSchemaBuilder()->getColumnListing($table)
        ));
    }

    /** Ids present in the backup but not here. */
    private function missingIds(string $table): array
    {
        $here = DB::table($table)->pluck('id')->flip();

        return DB::connection('legacy')->table($table)
            ->orderBy('id')
            ->pluck('id')
            ->reject(fn ($id) => $here->has($id))
            ->values()
            ->all();
    }

    private function rowsById(string $table, array $ids): Collection
    {
        return DB::connection('legacy')->table($table)
            ->select($this->sharedColumns($table))
            ->whereIn('id', $ids)
            ->orderBy('id')
            ->get();
    }

    /**
     * Product categories, which products point at and so must exist first.
     *
     * A category the backup does not have is left alone rather than deleted:
     * the new site added one and its main menu links to it, and dropping it
     * would break that link for the sake of tidiness.
     */
    private function importCategories(): void
    {
        $ids = $this->missingIds('categories');
        $rows = $this->rowsById('categories', $ids)->map(function ($row) {
            $row = (array) $row;
            $row['image'] = $this->rewriteImagePath($row['image'] ?? null);

            if ($row['image'] !== null) {
                $this->copyLegacyFile($row['image']);
            }

            return $row;
        })->all();

        $this->insertRows('categories', $rows);
        $this->note('categories inserted', count($rows));
    }

    /**
     * The three saris added after the seed, with their images.
     *
     * Product rows carry image locations as absolute URLs on the old admin host;
     * here they are paths under public/. The files themselves only exist in the
     * backup, so they are copied in before the row that references them.
     */
    private function importProducts(): void
    {

        $ids = $this->missingIds('products');

        if ($ids === []) {
            $this->note('products inserted', 0);

            return;
        }

        $copied = 0;
        $rows = [];

        foreach ($this->rowsById('products', $ids) as $row) {
            $row = (array) $row;
            $name = $row['product_name'] ?? null;

            $featured = $this->rewriteImagePath($row['featured_image'] ?? null);
            if ($featured !== null) {
                $copied += (int) $this->copyLegacyFile($featured);
                // Featured images are stored with a leading slash here.
                $row['featured_image'] = '/'.$featured;
            }

            $gallery = [];
            foreach ($this->decodeGallery($row['gallery_images'] ?? null) as $entry) {
                $path = $this->rewriteImagePath($entry);
                if ($path === null) {
                    continue;
                }
                $copied += (int) $this->copyLegacyFile($path);
                // Gallery entries are stored relative, without the slash.
                $gallery[] = $path;
            }
            $row['gallery_images'] = json_encode($gallery, JSON_UNESCAPED_UNICODE);

            $rows[] = $row;
        }

        $this->insertRows('products', $rows);

        $this->note('product image files copied', $copied);
        $this->note('products inserted', count($rows));
    }

    /**
     * Storefront accounts, almost all of them guest checkouts.
     *
     * Each one also needs the Customer role: the admin gate reads Spatie roles,
     * and the backfill migration that assigned them has already run, so accounts
     * arriving now would otherwise be the only role-less ones in the system.
     */
    /**
     * Storefront accounts, almost all of them guest checkouts.
     *
     * An account is its email address, not its id. Both systems kept issuing
     * ids after the seed, so a handful now disagree — id 711 is a real customer
     * in the backup and the developer's own login here. Matching on id would
     * have dropped those customers, so email decides whether an account is
     * already present, and one whose id is taken is inserted under a new id.
     *
     * The old id is remembered either way, because orders address their customer
     * by it and have to be pointed at wherever the account actually landed.
     *
     * Each account also needs the Customer role: the admin gate reads Spatie
     * roles, and the migration that backfilled them has already run, so accounts
     * arriving now would otherwise be the only role-less ones in the system.
     */
    private function importUsers(): void
    {
        $existingByEmail = DB::table('users')->pluck('id', 'email');
        $takenIds = DB::table('users')->pluck('id')->flip();

        $keepingId = [];
        $needingId = [];
        $newIds = [];
        $renumbered = 0;

        foreach (DB::connection('legacy')->table('users')->select($this->sharedColumns('users'))->orderBy('id')->get() as $row) {
            $row = (array) $row;
            $legacyId = $row['id'];

            if ($existingByEmail->has($row['email'])) {
                // Already here — under this id or, from an earlier run, another.
                $this->userIdMap[$legacyId] = $existingByEmail->get($row['email']);

                continue;
            }

            if ($takenIds->has($legacyId)) {
                unset($row['id']);
                $needingId[$legacyId] = $row;

                continue;
            }

            $keepingId[] = $row;
            $this->userIdMap[$legacyId] = $legacyId;
            $newIds[] = $legacyId;
        }

        // Rows keeping their id go in first. Renumbering draws from the
        // auto-increment sequence, which would otherwise hand out an id that a
        // later row of this same import still needs.
        $this->insertRows('users', $keepingId);

        foreach ($needingId as $legacyId => $row) {
            $id = $this->insertOne('users', $row);
            $this->userIdMap[$legacyId] = $id;
            $newIds[] = $id;
            $renumbered++;
        }

        $this->note('users inserted', count($newIds));
        $this->note('users renumbered (id taken)', $renumbered);
    }

    /**
     * Labels every account that has no role at all as a Customer.
     *
     * Runs after the staff roles are back, and only touches accounts with
     * nothing — the same rule the backfill migration used, so an administrator
     * does not also come out labelled as one of their own customers.
     */
    private function assignCustomerRoles(): void
    {
        $roleId = DB::table('roles')
            ->where('name', self::CUSTOMER_ROLE)->where('guard_name', 'web')->value('id');

        if ($roleId === null || $this->dryRun) {
            $this->note('customer roles assigned', 0);

            return;
        }

        $unassigned = DB::table('users')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('model_has_roles')
                    ->whereColumn('model_has_roles.model_id', 'users.id')
                    ->where('model_has_roles.model_type', User::class);
            })
            ->pluck('id');

        foreach ($unassigned->chunk(500) as $chunk) {
            DB::table('model_has_roles')->insertOrIgnore(
                $chunk->map(fn ($id) => [
                    'role_id' => $roleId,
                    'model_type' => User::class,
                    'model_id' => $id,
                ])->all()
            );
        }

        $this->note('customer roles assigned', $unassigned->count());
    }

    /**
     * Counter sales, and the three repairs the new schema expects of them.
     *
     * As with accounts, ids disagree: six of these orders have an id that a
     * local test order already holds here, so an order is recognised by what it
     * records — customer, phone, total and the moment it was placed — and one
     * whose id is taken is inserted under a new id.
     *
     * `user_identifier` holds the customer's id, so it is rewritten through the
     * account map. That also repairs orders imported earlier: a real order
     * addressing customer 711 currently resolves to the developer's login,
     * because that is who 711 is in this database. Those rows are corrected
     * where — and only where — the account they name actually moved.
     *
     * Invoice numbers came from an unchecked `rand(1000, 9999)`, so some
     * arriving orders reuse a number already held here, and the column is now
     * unique. The existing rule is followed: the order that had it first keeps
     * it, the newcomer is issued a fresh number, and its old one is kept in
     * `legacy_invoice_number` so support can still find it.
     *
     * The POS also hardcoded `delivery` to 'N/A', discarding the area chosen at
     * the till. The charge identifies it — the shop has two rates — which is
     * what the backfill migration used, and it is applied here for the same
     * reason: without it every one of these orders shows a blank area.
     */
    private function importOrders(): void
    {
        $present = $this->tallyBy('orders', fn ($row) => $this->orderKey($row));

        $takenIds = DB::table('orders')->pluck('id')->flip();
        $takenInvoices = DB::table('orders')->whereNotNull('invoice_number')->pluck('invoice_number')->flip();
        $insideRate = (float) DB::table('site_infos')->value('shipping_charge_inside_dhaka');

        $keepingId = [];
        $needingId = [];
        $reassigned = [];
        $inserted = 0;
        $renumbered = 0;
        $relinked = 0;
        $areasFixed = 0;

        foreach (DB::connection('legacy')->table('orders')->select($this->sharedColumns('orders'))->orderBy('id')->get() as $row) {
            $row = (array) $row;
            $legacyId = $row['id'];
            $customerId = $this->userIdMap[$row['user_identifier']] ?? $row['user_identifier'];
            $key = $this->orderKey($row);

            // Already here, under this id or one assigned on an earlier run.
            if (! empty($present[$key])) {
                $existingId = array_shift($present[$key]);
                $this->orderIdMap[$legacyId] = $existingId;

                if ($this->relinkCustomer($existingId, $customerId)) {
                    $relinked++;
                }

                continue;
            }

            $row['user_identifier'] = $customerId;
            $row['order_type'] = $this->channelFor($row);

            $invoice = $row['invoice_number'] ?? null;
            if ($invoice !== null && $invoice !== '' && $takenInvoices->has($invoice)) {
                $fresh = $this->freshInvoiceNumber($takenInvoices);
                $row['legacy_invoice_number'] = $invoice;
                $row['invoice_number'] = $fresh;
                $reassigned[] = "order {$legacyId}: {$invoice} -> {$fresh}";
                $invoice = $fresh;
            }
            if ($invoice !== null && $invoice !== '') {
                $takenInvoices->put($invoice, true);
            }
            // Present on every row so the batch insert stays rectangular.
            $row['legacy_invoice_number'] = $row['legacy_invoice_number'] ?? null;

            // Every arriving order predates the payment columns and was cash at
            // the counter, which is what the backfill assumed for the rest.
            $row['payment_type'] = $row['payment_type'] ?? 'cod';
            $row['payment_status'] = 'unpaid';
            $row['paid_amount'] = 0;

            $charge = (float) ($row['delivery_charge'] ?? 0);
            if (! in_array($row['delivery'] ?? null, ['inside', 'outside'], true) && $charge > 0 && $insideRate > 0) {
                $row['delivery'] = $charge === $insideRate ? 'inside' : 'outside';
                $areasFixed++;
            }

            if ($takenIds->has($legacyId)) {
                unset($row['id']);
                $needingId[$legacyId] = $row;
            } else {
                $keepingId[] = $row;
                $this->orderIdMap[$legacyId] = $legacyId;
            }

            $inserted++;
        }

        // Keepers first, for the reason given in importUsers().
        $this->insertRows('orders', $keepingId, 250);

        foreach ($needingId as $legacyId => $row) {
            $this->orderIdMap[$legacyId] = $this->insertOne('orders', $row);
            $renumbered++;
        }

        $this->note('orders inserted', $inserted);
        $this->note('orders renumbered (id taken)', $renumbered);
        $this->note('orders relinked to customer', $relinked);
        $this->note('invoice numbers reassigned', count($reassigned));
        $this->note('delivery areas recovered', $areasFixed);

        foreach ($reassigned as $line) {
            $this->line("      {$line}");
        }
    }

    /**
     * Points an already-imported order at the account it names, if that account
     * was renumbered on the way in.
     *
     * Deliberately narrow: it only ever moves an order from an id the map says
     * belongs to someone else, so a local test order that legitimately points at
     * a local account is not touched.
     */
    private function relinkCustomer(int $orderId, int|string $customerId): bool
    {
        $current = DB::table('orders')->where('id', $orderId)->value('user_identifier');

        if ((string) $current === (string) $customerId) {
            return false;
        }

        if (! $this->dryRun) {
            DB::table('orders')->where('id', $orderId)->update(['user_identifier' => $customerId]);
        }

        return true;
    }

    private function freshInvoiceNumber(Collection $taken): string
    {
        do {
            $candidate = Order::generateInvoiceNumber();
        } while ($taken->has($candidate));

        return $candidate;
    }

    /**
     * Line items, which carry foreign keys to orders and products both — hence
     * running after each of them.
     *
     * Their ids disagree for the same reason everything else's do, and their
     * `order_id` has to follow whatever id its order ended up with. A line is
     * identified by what it says — order, product, quantity and price — so one
     * already present under any id is left alone. Nothing points at
     * `order_items.id` (`order_item_options` is the only referrer, empty in both
     * systems), so renumbering these costs nothing.
     */
    private function importOrderItems(): void
    {
        $present = $this->tallyBy('order_items', fn ($row) => $this->orderItemKey($row));

        $takenIds = DB::table('order_items')->pluck('id')->flip();

        $keepingId = [];
        $renumbering = [];
        $inserted = 0;

        foreach (DB::connection('legacy')->table('order_items')->select($this->sharedColumns('order_items'))->orderBy('id')->get() as $row) {
            $row = (array) $row;
            $row['order_id'] = $this->orderIdMap[$row['order_id']] ?? $row['order_id'];

            $key = $this->orderItemKey($row);

            if (! empty($present[$key])) {
                array_shift($present[$key]);

                continue;
            }

            if ($takenIds->has($row['id'])) {
                unset($row['id']);
                $renumbering[] = $row;
            } else {
                $keepingId[] = $row;
            }

            $inserted++;
        }

        // Keepers first, for the reason given in importUsers().
        $this->insertRows('order_items', $keepingId);
        $this->insertRows('order_items', $renumbering);

        $this->note('order_items inserted', $inserted);
        $this->note('order_items renumbered (id taken)', count($renumbering));

        $ids = $this->missingIds('order_item_options');
        $options = $this->rowsById('order_item_options', $ids)->map(fn ($r) => (array) $r)->all();
        $this->insertRows('order_item_options', $options);
        $this->note('order_item_options inserted', count($options));
    }

    /**
     * Groups the ids of rows already here by identity, so a source row can ask
     * "is this already present, whatever id it wound up with?".
     *
     * A list rather than a flag, because an order really can contain the same
     * product twice at the same price, and both lines have to survive.
     *
     * @return array<string, list<int>>
     */
    private function tallyBy(string $table, callable $key): array
    {
        $tally = [];

        DB::table($table)->orderBy('id')->chunk(1000, function ($rows) use (&$tally, $key) {
            foreach ($rows as $row) {
                $tally[$key((array) $row)][] = (int) $row->id;
            }
        });

        return $tally;
    }

    /** What makes an order that order, ignoring its id. */
    private function orderKey(array $row): string
    {
        return implode('|', [
            $row['customer_name'] ?? '',
            $row['phone_number'] ?? '',
            (float) ($row['total_price'] ?? 0),
            $row['created_at'] ?? '',
        ]);
    }

    private function orderItemKey(array $row): string
    {
        return implode('|', [
            $row['order_id'] ?? '',
            $row['product_id'] ?? '',
            $row['quantity'] ?? '',
            // Cast through float so "1800.00" and "1800.0" are the same price.
            (float) ($row['price'] ?? 0),
        ]);
    }

    /**
     * Open baskets.
     *
     * Ids disagree here too — two of these sit on an id a local basket already
     * holds. A basket is identified the way the table's own unique constraint
     * does, by shopper, product and attribute choice, and one whose id is taken
     * is renumbered. `cart_attributes` is the only thing pointing at
     * `carts.id` and is empty in both systems, so that is free.
     */
    private function importCarts(): void
    {
        $present = $this->tallyBy('carts', fn ($row) => $this->cartKey($row));
        $takenIds = DB::table('carts')->pluck('id')->flip();

        $keepingId = [];
        $renumbering = [];

        foreach (DB::connection('legacy')->table('carts')->select($this->sharedColumns('carts'))->orderBy('id')->get() as $row) {
            $row = (array) $row;

            if (! empty($present[$this->cartKey($row)])) {
                array_shift($present[$this->cartKey($row)]);

                continue;
            }

            if ($takenIds->has($row['id'])) {
                unset($row['id']);
                $renumbering[] = $row;
            } else {
                $keepingId[] = $row;
            }
        }

        // Keepers first, for the reason given in importUsers().
        $this->insertRows('carts', $keepingId);
        $this->insertRows('carts', $renumbering);

        $this->note('carts inserted', count($keepingId) + count($renumbering));
        $this->note('carts renumbered (id taken)', count($renumbering));

        $ids = $this->missingIds('cart_attributes');
        $attributes = $this->rowsById('cart_attributes', $ids)->map(fn ($r) => (array) $r)->all();
        $this->insertRows('cart_attributes', $attributes);
        $this->note('cart_attributes inserted', count($attributes));
    }

    /**
     * What makes a basket line that line — the same three columns the table's
     * `unique_cart` index is built on.
     */
    private function cartKey(array $row): string
    {
        return implode('|', [
            $row['user_identifier'] ?? '',
            $row['product_id'] ?? '',
            $row['attribute_hash'] ?? '',
        ]);
    }

    /**
     * Tables with no dependency of their own: customer messages, admin
     * notifications, and the supply-chain and financial records.
     *
     * Suppliers, purchases, payments and transactions are already complete and
     * identical to the backup; they are listed so a future divergence is caught
     * and filled rather than silently missed.
     */
    private function importSimpleTables(): void
    {
        // Parents before the rows that point at them. `insertOrIgnore` treats a
        // foreign-key violation as something to skip rather than raise, so a
        // child imported too early is dropped in silence — which is how the two
        // ledger transactions went missing behind a summary line that claimed
        // it had inserted them.
        $tables = [
            // Referenced by others.
            'account_types',
            'purposes',
            'suppliers',
            'attributes',
            'coupons',
            'campaigns',
            // Reference the above.
            'attribute_options',
            'purchases',
            'payments',
            'transactions',
            'transfers',
            'product_attributes',
            'product_attribute_combinations',
            'coupon_product',
            'product_campaign',
            // Independent.
            'contact_messages',
            'notifications',
            'user_addresses',
            'comments',
            'wishlists',
        ];

        foreach ($tables as $table) {
            if (! DB::getSchemaBuilder()->hasTable($table)
                || ! DB::connection('legacy')->getSchemaBuilder()->hasTable($table)) {
                continue;
            }

            $ids = $this->missingIds($table);

            if ($ids === []) {
                continue;
            }

            $rows = $this->rowsById($table, $ids)->map(fn ($r) => (array) $r)->all();

            $this->insertRows($table, $rows);

            $this->note("{$table} inserted", count($rows));
        }
    }

    /**
     * Which sales channel an order came through.
     *
     * The two systems disagree about where this is recorded. The old admin
     * panel wrote `order_type = 'pos'` on every single order — all 831 of them,
     * counter sales and storefront alike — and kept the real distinction in
     * `user_purchase_type`: 'online' for a delivery, 'offline' for a counter
     * sale. The new panel reads `order_type` instead (Order::scopePos,
     * ReportRepository), so copying the old value across verbatim files every
     * web order as a till sale and the POS report counts the whole shop.
     *
     * `user_purchase_type` separates them cleanly and is worth trusting: all
     * 747 online orders carry a delivery charge, and 80 of the 84 offline ones
     * carry none — which is the same rule OrderService uses when it decides the
     * value for a new order.
     */
    private function channelFor(array $row): string
    {
        return ($row['user_purchase_type'] ?? null) === 'offline'
            ? Order::TYPE_POS
            : 'checkout';
    }

    /**
     * Empties the tables the backup owns, so the import rebuilds them from
     * scratch rather than merging into what is already here.
     *
     * Only the trading records go. Everything this site has that the old one
     * never had — its pages, blogs, menus, layout, email templates, branding,
     * courier and SMS settings — is left standing, as are `roles` and
     * `permissions`, which the new panel defines for itself.
     *
     * Two things survive the wipe deliberately. Staff role assignments are
     * captured first and restored by email afterwards, because the backup's
     * `model_has_roles` holds two rows and would otherwise leave the shop with
     * no administrator. And categories are cleared by id rather than truncated,
     * so a category the new site added and its menu points at is not dropped
     * along with the ones the backup replaces.
     */
    private function clearBusinessTables(): void
    {
        // Children first; the order is only cosmetic while the checks are off,
        // but it documents the dependencies.
        $tables = [
            'order_item_options', 'order_items', 'orders',
            'cart_attributes', 'carts',
            'wishlists', 'user_addresses', 'model_has_roles', 'users',
            'product_attribute_combinations', 'product_attributes',
            'product_campaign', 'coupon_product', 'products',
            'payments', 'purchases', 'suppliers',
            'transactions', 'transfers',
            'contact_messages', 'notifications', 'comments',
            'attributes', 'attribute_options',
            'coupons', 'campaigns',
            'account_types', 'purposes',
            'media_library_items',
        ];

        $this->staffRoles = DB::table('users')
            ->join('model_has_roles', function ($join) {
                $join->on('model_has_roles.model_id', '=', 'users.id')
                    ->where('model_has_roles.model_type', User::class);
            })
            ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->where('roles.name', '!=', self::CUSTOMER_ROLE)
            ->select('users.email', 'roles.id as role_id')
            ->get()
            ->groupBy('email')
            ->map(fn ($rows) => $rows->pluck('role_id')->all())
            ->all();

        $cleared = 0;

        if (! $this->dryRun) {
            Schema::disableForeignKeyConstraints();

            foreach ($tables as $table) {
                if (DB::getSchemaBuilder()->hasTable($table)) {
                    $cleared += DB::table($table)->count();
                    DB::table($table)->truncate();
                }
            }

            // Only the categories the backup is about to supply.
            $replacing = DB::connection('legacy')->table('categories')->pluck('id');
            $cleared += DB::table('categories')->whereIn('id', $replacing)->delete();

            Schema::enableForeignKeyConstraints();
        }

        $this->note('rows cleared for fresh import', $cleared);
        $this->note('staff accounts whose roles will be restored', count($this->staffRoles));
    }

    /**
     * Gives back the staff their roles after the wipe, matching on email
     * because ids are reassigned during the import.
     */
    private function restoreStaffRoles(): void
    {
        if ($this->staffRoles === [] || $this->dryRun) {
            return;
        }

        $restored = 0;

        foreach ($this->staffRoles as $email => $roleIds) {
            $userId = DB::table('users')->where('email', $email)->value('id');

            if ($userId === null) {
                $this->warn("      staff account no longer present, role not restored: {$email}");

                continue;
            }

            foreach ($roleIds as $roleId) {
                DB::table('model_has_roles')->insertOrIgnore([
                    'role_id' => $roleId,
                    'model_type' => User::class,
                    'model_id' => $userId,
                ]);
                $restored++;
            }
        }

        $this->note('staff role assignments restored', $restored);
    }

    /**
     * Copies every image, video and document in the backup, not just the ones
     * something currently points at.
     *
     * The catalogue is 35 saris; the backup holds the artwork for years of them,
     * most long since delisted. Those files are the shop's own photography, and
     * once the library is the place staff pick images from, a file that is not
     * in it may as well not exist. So the whole set comes across.
     *
     * Folders keep their names, under `public/storage` — the same mapping the
     * product rows already use — except `uploads` and `invoice`, which this site
     * serves from `public/` directly and which already hold files of their own.
     */
    private function copyAllBackupMedia(): void
    {
        $filesRoot = $this->option('files');

        if (! $filesRoot || ! is_dir($filesRoot)) {
            $this->warn('  --all-media needs --files pointing at the backup public/ directory; skipped.');

            return;
        }

        // folder in the backup => folder here
        $folders = [
            'featured_image' => 'storage/featured_image',
            'gallery' => 'storage/gallery',
            'products' => 'storage/products',
            'Category' => 'storage/Category',
            'slider' => 'storage/slider',
            'media' => 'storage/media',
            'brands' => 'storage/brands',
            'landing_pages' => 'storage/landing_pages',
            'icon' => 'storage/icon',
            'document' => 'storage/document',
            'uploads' => 'uploads',
            'invoice' => 'invoice',
        ];

        $copied = 0;
        $skipped = 0;
        $bytes = 0;

        foreach ($folders as $from => $to) {
            $source = rtrim($filesRoot, '/').'/'.$from;

            if (! is_dir($source)) {
                continue;
            }

            foreach ($this->mediaFilesIn($source) as $file) {
                $relative = $to.'/'.ltrim(Str::after($file, $source), '/');
                $destination = public_path($relative);

                // Registered whether it arrived just now or on an earlier run:
                // the library is rebuilt by --fresh, so a file already on disk
                // still needs its row back. Registering is idempotent.
                $this->pendingRegistration[] = $relative;

                if (file_exists($destination)) {
                    $skipped++;

                    continue;
                }

                if ($this->dryRun) {
                    $copied++;
                    $bytes += filesize($file) ?: 0;

                    continue;
                }

                if (! is_dir(dirname($destination))) {
                    mkdir(dirname($destination), 0755, true);
                }

                if (copy($file, $destination)) {
                    $copied++;
                    $bytes += filesize($destination) ?: 0;
                }
            }
        }

        $this->note('backup media files copied', $copied);
        $this->note('backup media already present', $skipped);
        $this->note('megabytes copied', (int) round($bytes / 1048576));
    }

    /**
     * Media files inside a backup folder, recursively.
     *
     * @return \Generator<string>
     */
    private function mediaFilesIn(string $dir): \Generator
    {
        $keep = [
            'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'bmp', 'ico',
            'mp4', 'webm', 'ogv', 'mov', 'm4v',
            'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv',
        ];

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if ($file->isFile() && in_array(strtolower($file->getExtension()), $keep, true)) {
                yield $file->getPathname();
            }
        }
    }

    /**
     * Puts every file the imported rows point at into the media library.
     *
     * `media:import-existing` is the panel's own indexer and is idempotent, so
     * it handles registration and the file metadata. It titles items from the
     * filename, which for `media_6a33c0fe41e2a.webp` says nothing — so an image
     * a product uses is then named after that product and given it as alt text,
     * which is what the library search and the storefront read.
     *
     * Titles are taken from the products table rather than from what this run
     * happened to insert, so the naming is applied even when the rows arrived
     * on an earlier run. Only items with no alt text are touched: a caption
     * someone has already written is theirs, not ours to overwrite.
     */
    private function registerMedia(): void
    {
        if ($this->dryRun) {
            $this->note('media library items registered', 0);

            return;
        }

        $before = MediaLibraryItem::count();

        $this->call('media:import-existing');

        // Files copied by --all-media sit under public/storage, which
        // media:import-existing does not scan, and nothing references them yet
        // — so they are handed to the registrar directly.
        $registrar = app(MediaLibraryRegistrar::class);

        foreach ($this->pendingRegistration as $path) {
            $registrar->register($path);
        }

        $this->note('media library items registered', MediaLibraryItem::count() - $before);

        $described = 0;

        foreach ($this->productImagePaths() as $path => $productName) {
            $item = MediaLibraryItem::where('path', $path)->whereNull('alt_text')->first();

            if ($item === null) {
                continue;
            }

            $item->forceFill(['title' => $productName, 'alt_text' => $productName])->save();
            $described++;
        }

        $this->note('media items named after their product', $described);
    }

    /**
     * Every image path a product points at, mapped to that product's name.
     *
     * The first product to claim a path wins, so an image shared by two
     * products is named after one of them rather than flipping between runs.
     *
     * @return array<string, string>
     */
    private function productImagePaths(): array
    {
        $paths = [];

        DB::table('products')
            ->select('product_name', 'featured_image', 'gallery_images')
            ->orderBy('id')
            ->chunk(200, function ($products) use (&$paths) {
                foreach ($products as $product) {
                    $entries = array_merge(
                        [$product->featured_image],
                        $this->decodeGallery($product->gallery_images)
                    );

                    foreach (array_filter($entries) as $entry) {
                        $path = ltrim($entry, '/');

                        if ($path !== '' && ! isset($paths[$path])) {
                            $paths[$path] = $product->product_name;
                        }
                    }
                }
            });

        return $paths;
    }

    /**
     * `https://admin.charukothon.com/gallery/x.webp` -> `storage/gallery/x.webp`.
     *
     * The folder is kept, which is the mapping the seeded products already use.
     * Anything that is not an old-host URL is passed through unchanged, so a row
     * already holding a local path survives a re-run untouched.
     */
    private function rewriteImagePath(?string $value): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        $path = ltrim(parse_url(trim($value), PHP_URL_PATH) ?: trim($value), '/');

        if ($path === '') {
            return null;
        }

        if (Str::startsWith($path, self::LEGACY_HOST_PATH.'/')) {
            return $path;
        }

        return self::LEGACY_HOST_PATH.'/'.$path;
    }

    /**
     * Gallery lists arrive JSON-encoded twice — a string holding a JSON array —
     * and are stored here encoded once, which is what the model's array cast
     * expects.
     *
     * @return list<string>
     */
    private function decodeGallery(mixed $value): array
    {
        $decoded = is_string($value) ? json_decode($value, true) : $value;

        if (is_string($decoded)) {
            $decoded = json_decode($decoded, true);
        }

        if (! is_array($decoded)) {
            return [];
        }

        return array_values(array_filter($decoded, 'is_string'));
    }

    /** Copies `storage/gallery/x.webp` out of the backup, if it is not here yet. */
    private function copyLegacyFile(string $relativePath): bool
    {
        $filesRoot = $this->option('files');

        if (! $filesRoot) {
            return false;
        }

        $destination = public_path($relativePath);

        if (file_exists($destination)) {
            return false;
        }

        // The backup serves from public/ directly; here the same folders sit
        // under public/storage.
        $source = rtrim($filesRoot, '/').'/'.Str::after($relativePath, self::LEGACY_HOST_PATH.'/');

        if (! is_file($source)) {
            $this->warn("      missing in backup: {$source}");

            return false;
        }

        if ($this->dryRun) {
            return true;
        }

        if (! is_dir(dirname($destination))) {
            mkdir(dirname($destination), 0755, true);
        }

        return copy($source, $destination);
    }

    /**
     * Inserts one row and returns the id it was given.
     *
     * Only for the few rows that cannot keep their own id: a batch insert does
     * not report back what it assigned, and the rows that depend on these need
     * to know. On a dry run nothing is written and the id the row *would* take
     * is returned, so the rest of the walk still lines up.
     */
    private function insertOne(string $table, array $row): int
    {
        if ($this->dryRun) {
            return (int) DB::table($table)->max('id') + ++$this->pretendInserts;
        }

        return (int) DB::table($table)->insertGetId($row);
    }

    /**
     * Inserts rows in chunks, ignoring ids that are already present.
     *
     * Every row is squared up to the same key set first: a batch insert sends
     * one column list for the whole chunk, so a single row carrying an extra
     * key — an order that needed `legacy_invoice_number`, say — would otherwise
     * take the rest of the chunk down with it.
     */
    private function insertRows(string $table, array $rows, int $chunkSize = 500): void
    {
        if ($this->dryRun || $rows === []) {
            return;
        }

        $columns = [];
        foreach ($rows as $row) {
            $columns += array_flip(array_keys($row));
        }
        $template = array_fill_keys(array_keys($columns), null);

        $before = DB::table($table)->count();

        foreach (array_chunk($rows, $chunkSize) as $chunk) {
            DB::table($table)->insertOrIgnore(
                array_map(fn ($row) => array_replace($template, $row), $chunk)
            );
        }

        // `insertOrIgnore` downgrades a rejected row to a warning, so the only
        // way to know every row landed is to count. Silence here once cost two
        // ledger entries; anything dropped now says so.
        $landed = DB::table($table)->count() - $before;

        if ($landed !== count($rows)) {
            $this->dropped[$table] = ($this->dropped[$table] ?? 0) + (count($rows) - $landed);
        }
    }

    private function note(string $label, int $count): void
    {
        $this->summary[$label] = $count;
        $this->line(sprintf('  %-34s %d', $label, $count));
    }
}
