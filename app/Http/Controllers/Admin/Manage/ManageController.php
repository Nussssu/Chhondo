<?php

namespace App\Http\Controllers\Admin\Manage;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Http\Requests\Admin\Manage_site\StoreOrUpdateSiteRequest;
use App\Http\Requests\Admin\Smtp\SmtpSettingRequest;
use App\Mail\TemplatedMail;
use App\Models\EmailTemplate;
use App\Models\SiteInfo;
use App\Repositories\Admin\Smtp\SmtpSettingRepositoryInterface;
use App\Services\Admin\Manage_site\SiteServiceInterface;
use App\Services\ImageUploadService;
use App\Services\Mail\EmailBrand;
use App\Services\Mail\EmailTemplateRenderer;
use App\Services\Mail\MailConfigurator;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class ManageController extends Controller
{
    protected $siteService;
    protected $imageUploadService;
    protected $smtpSettingRepository;

    public function __construct(SiteServiceInterface $siteService, ImageUploadService $imageUploadService, SmtpSettingRepositoryInterface $smtpSettingRepository)
    {
        $this->siteService           = $siteService;
        $this->imageUploadService    = $imageUploadService;
        $this->smtpSettingRepository = $smtpSettingRepository;
    }

    public function index()
    {

        $siteInfo = $this->siteService->getSiteInfo()->first();

        return Inertia::render('Admin/Manage/Index', ['siteInfo' => $siteInfo]);
    }

    /** Delivery charges and the shop-wide free-shipping rule. */
    public function delivery()
    {
        return Inertia::render('Admin/Manage/Delivery', [
            'siteInfo' => $this->siteService->getSiteInfo()->first(),
        ]);
    }

    public function smtpSetting()
    {
        $smtp = $this->smtpSettingRepository->getSmtpSetting();

        return Inertia::render('Admin/Manage/SmtpSetting', [
            // The saved password is never sent to the browser; a blank field
            // means "keep it", which is also how the form saves.
            'smtp'      => $smtp ? Arr::except($smtp->toArray(), ['smtp_password']) : null,
            'hasPassword' => filled($smtp?->smtp_password),
            'templates' => EmailTemplate::all_resolved(),
            'logoSet'   => app(EmailBrand::class)->logoPath() !== null,
        ]);
    }

    public function socialMediaLinks()
    {
        $siteInfo = $this->siteService->getSiteInfo()->first();

        return Inertia::render('Admin/Manage/SocialMediaLinks', ['siteInfo' => $siteInfo]);
    }

    public function storeOrUpdateSite(StoreOrUpdateSiteRequest $request)
    {
        try {
            $imageUrl = null;

            if ($request->hasFile('store_gateway_image')) {
                $image = $request->file('store_gateway_image');

                $imageName       = time() . '_' . $image->getClientOriginalName();
                $destinationPath = public_path('assets/image/admin/manage');
                $image->move($destinationPath, $imageName);

                $imageUrl = asset('assets/image/admin/manage/' . $imageName);
            } elseif ($request->filled('store_gateway_image_library_path')) {
                $imageUrl = $request->input('store_gateway_image_library_path');
            } else {
                $imageUrl = optional(SiteInfo::first())->store_gateway_image;
            }

            // Prepare final data explicitly
            // The Steadfast and maintenance switches each save on their own
            // screen; this form must never overwrite them.
            $data = $request->except(['store_gateway_image', 'store_gateway_image_library_path', 'steadfast_webhook', 'maintenance_mode']);
            $data['store_gateway_image'] = $imageUrl;

            // Update or create
            SiteInfo::updateOrCreate(['id' => 1], $data);

            return redirect()->back()->with('success', 'Site info updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong: ' . $e->getMessage());
        }
    }


    /**
     * Open or close the storefront. Saved on its own, apart from the General
     * form, so flipping the switch cannot also resubmit every other field.
     */
    public function updateMaintenanceMode(Request $request)
    {
        $validated = $request->validate(['enabled' => 'required|boolean']);
        $enabled   = (bool) $validated['enabled'];

        SiteInfo::updateOrCreate(['id' => 1], ['maintenance_mode' => $enabled]);

        // The model drops this on update, but not when the row is first created.
        Cache::forget(SiteInfo::MAINTENANCE_CACHE_KEY);

        return redirect()->back()->with('success', $enabled
            ? 'Maintenance mode is on. Visitors now see the maintenance page.'
            : 'Maintenance mode is off. The store is open again.');
    }

    public function storeOrUpdateSmtp(SmtpSettingRequest $request)
    {
        try {
            $data = $request->validated();

            $data['use_smtp'] = $request->boolean('use_smtp');
            // The column is NOT NULL with a foreign key and was never being
            // written, so the very first save on a fresh install failed.
            $data['user_id'] = $request->user()?->id;
            // "none" is how the form says "no encryption"; the mailer wants null.
            $data['smtp_encryption'] = ($data['smtp_encryption'] ?? '') === 'none'
                ? null
                : ($data['smtp_encryption'] ?? null);

            // The password field comes back blank when it was not retyped —
            // saving that would silently wipe a working configuration.
            if (blank($data['smtp_password'] ?? null)) {
                unset($data['smtp_password']);
            }

            // The server settings are kept even when SMTP is switched off, so
            // turning it back on does not mean typing them all again.
            $this->smtpSettingRepository->storeOrUpdateSmtpSetting($data);

            // The mailer caches its transport for the process; re-read so a
            // test sent straight after saving uses what was just saved.
            app(MailConfigurator::class)->apply(force: true);

            return redirect()->back()->with('success', 'Email settings saved.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /** Save the wording of one email, or switch it off. */
    public function updateEmailTemplate(Request $request, string $key)
    {
        abort_if(EmailTemplate::definition($key) === null, 404);

        $data = $request->validate([
            'subject'    => 'required|string|max:255',
            'heading'    => 'nullable|string|max:255',
            'intro'      => 'nullable|string|max:2000',
            'outro'      => 'nullable|string|max:2000',
            'is_enabled' => 'boolean',
        ]);

        $data['is_enabled'] = $request->boolean('is_enabled');

        EmailTemplate::updateOrCreate(['key' => $key], $data);

        return redirect()->back()->with('success', 'Email template saved.');
    }

    /** Put one email back to the wording it ships with. */
    public function resetEmailTemplate(string $key)
    {
        abort_if(EmailTemplate::definition($key) === null, 404);

        EmailTemplate::where('key', $key)->delete();

        return redirect()->back()->with('success', 'Email template reset to its default wording.');
    }

    /**
     * Send one email to a chosen address, so the settings can be proved to work
     * without placing a real order.
     */
    public function sendTestEmail(Request $request)
    {
        $data = $request->validate([
            'to'  => 'required|email',
            'key' => 'nullable|string',
        ]);

        $config = app(MailConfigurator::class);

        if (! $config->isConfigured()) {
            return back()->withErrors(['to' => 'Save a from address (and an SMTP host, if you use one) before sending a test.']);
        }

        try {
            $config->apply(force: true);

            $brand    = app(EmailBrand::class);
            $renderer = app(EmailTemplateRenderer::class);

            $template = [
                'subject' => 'Test email from ' . $brand->name(),
                'heading' => 'Your email settings are working',
                'intro'   => 'This is a test message sent from Store settings › Email.',
                'outro'   => 'Nothing was sent to any customer.',
                'view'    => 'emails.test',
            ];

            Mail::to($data['to'])->send(new TemplatedMail($template, $brand->toArray()));

            return back()->with('success', 'Test email sent to ' . $data['to'] . '.');
        } catch (\Throwable $e) {
            // The gateway's own words are the useful part of a failed test.
            return back()->withErrors(['to' => 'Could not send: ' . $e->getMessage()]);
        }
    }

    /**
     * Render one email in the browser exactly as it will be sent, filled with
     * the shop's most recent order where there is one.
     */
    public function previewEmailTemplate(string $key)
    {
        $definition = EmailTemplate::definition($key);
        abort_if($definition === null, 404);

        $brand    = app(EmailBrand::class);
        $renderer = app(EmailTemplateRenderer::class);

        $order = \App\Models\Order::with('items.product', 'items.options')->latest('id')->first();

        $tokens = $order
            ? $renderer->orderTokens($order)
            : [
                '{name}' => 'Customer name', '{invoice}' => 'INV-0000', '{total}' => 'Tk 0.00',
                '{items}' => '0', '{phone}' => '01700000000', '{address}' => 'Sample address',
                '{payment_method}' => 'Cash on delivery', '{status}' => 'shipped',
                '{tracking}' => '—', '{courier}' => '—', '{message}' => 'Sample enquiry text.',
            ];

        // Tokens no order can supply, so the preview fills them itself.
        $tokens += ['{expires}' => (string) config('auth.passwords.users.expire', 60)];

        $template = $renderer->render($key, $tokens);

        return view($template['view'], [
            'heading' => $template['heading'],
            'intro'   => $template['intro'],
            'outro'   => $template['outro'],
            'brand'   => $brand->toArray(),
            'order'   => $order,
            'enquiry' => 'Sample enquiry text.',
            'adminUrl' => null,
            // A real token is never minted for a preview; the button is shown
            // pointing at the reset form so the layout can be judged.
            'resetUrl' => route('password.request'),
        ]);
    }
}
