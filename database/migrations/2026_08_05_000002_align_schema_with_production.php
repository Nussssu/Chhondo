<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Brings database/migrations back in line with the production schema.
 *
 * Columns and one table had been added to the live database by hand and never
 * captured in a migration, so `php artisan migrate` on a new environment produced a
 * schema the application could not run against — `db:seed` failed outright, and
 * anything touching users.role, products.is_home, categories.serial and the rest
 * raised "column not found".
 *
 * Every definition here was read back from the live schema so a rebuilt database
 * matches it. All changes are guarded, so this is a no-op on the existing database
 * and safe to re-run.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['admin', 'user'])->default('user');
            }
            if (! Schema::hasColumn('users', 'is_block')) {
                $table->boolean('is_block')->default(false);
            }
            if (! Schema::hasColumn('users', 'image')) {
                $table->string('image')->nullable();
            }
            if (! Schema::hasColumn('users', 'ip_address')) {
                $table->string('ip_address', 250)->nullable();
            }
        });

        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'is_home')) {
                $table->boolean('is_home')->default(true);
            }
            if (! Schema::hasColumn('products', 'purchasing_price')) {
                $table->decimal('purchasing_price', 10, 0)->default(0);
            }
            if (! Schema::hasColumn('products', 'bullet_points')) {
                $table->longText('bullet_points')->nullable();
            }
            if (! Schema::hasColumn('products', 'video')) {
                $table->string('video', 250)->nullable();
            }
            if (! Schema::hasColumn('products', 'video_host')) {
                $table->string('video_host', 250)->nullable()->default('Gdrive');
            }
            if (! Schema::hasColumn('products', 'video_section_title')) {
                $table->string('video_section_title', 250)->nullable();
            }
            // NOT NULL with no default in production — matched deliberately.
            if (! Schema::hasColumn('products', 'color_links')) {
                $table->longText('color_links');
            }
        });

        Schema::table('categories', function (Blueprint $table) {
            if (! Schema::hasColumn('categories', 'serial')) {
                $table->integer('serial')->default(1);
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'author_id')) {
                $table->integer('author_id')->nullable();
            }
            if (! Schema::hasColumn('orders', 'user_purchase_type')) {
                $table->string('user_purchase_type', 250)->default('online');
            }
        });

        Schema::table('purchases', function (Blueprint $table) {
            if (! Schema::hasColumn('purchases', 'product_ids')) {
                $table->longText('product_ids')->nullable();
            }
            if (! Schema::hasColumn('purchases', 'products_data')) {
                $table->longText('products_data')->nullable();
            }
        });

        Schema::table('product_attributes', function (Blueprint $table) {
            if (! Schema::hasColumn('product_attributes', 'purchasing_price')) {
                $table->decimal('purchasing_price', 10, 0)->default(0);
            }
        });

        Schema::table('marketing_tools', function (Blueprint $table) {
            if (! Schema::hasColumn('marketing_tools', 'second_script')) {
                $table->text('second_script')->nullable();
            }
        });

        Schema::table('promotional_sms', function (Blueprint $table) {
            if (! Schema::hasColumn('promotional_sms', 'campaign_name')) {
                $table->string('campaign_name', 250)->nullable();
            }
        });

        Schema::table('site_infos', function (Blueprint $table) {
            // NOT NULL with no default in production — matched deliberately.
            if (! Schema::hasColumn('site_infos', 'footer_text')) {
                $table->text('footer_text');
            }
            foreach ([
                'mainColor' => 250,
                'secondColor' => 250,
                'cart_bg' => 250,
                'call_now_bg' => 255,
                'order_now_bg' => 250,
                'whatsapp_bg' => 250,
                'group_link' => 255,
            ] as $column => $length) {
                if (! Schema::hasColumn('site_infos', $column)) {
                    $table->string($column, $length)->nullable();
                }
            }
            if (! Schema::hasColumn('site_infos', 'steadfast_webhook')) {
                $table->boolean('steadfast_webhook')->default(false);
            }
        });

        // Missing from the migrations *and* from the live database, yet
        // ProductController::getPurchaseData() and PurchaseController's
        // product store/update/delete all query it — so those routes error in
        // production today. Columns taken from the code that writes to it.
        if (! Schema::hasTable('purchase_groups')) {
            Schema::create('purchase_groups', function (Blueprint $table) {
                $table->id();
                $table->foreignId('purchase_id')->constrained('purchases')->cascadeOnDelete();
                $table->string('name');
                $table->string('product_code')->index();
                $table->integer('quantity')->default(0);
                $table->decimal('price', 10, 2)->default(0);
                $table->decimal('total', 10, 2)->default(0);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_groups');

        $drops = [
            'users' => ['role', 'is_block', 'image', 'ip_address'],
            'products' => ['is_home', 'purchasing_price', 'bullet_points', 'video', 'video_host', 'video_section_title', 'color_links'],
            'categories' => ['serial'],
            'orders' => ['author_id', 'user_purchase_type'],
            'purchases' => ['product_ids', 'products_data'],
            'product_attributes' => ['purchasing_price'],
            'marketing_tools' => ['second_script'],
            'promotional_sms' => ['campaign_name'],
            'site_infos' => ['footer_text', 'mainColor', 'secondColor', 'cart_bg', 'call_now_bg', 'order_now_bg', 'whatsapp_bg', 'group_link', 'steadfast_webhook'],
        ];

        foreach ($drops as $tableName => $columns) {
            $present = array_values(array_filter(
                $columns,
                fn ($c) => Schema::hasColumn($tableName, $c)
            ));

            if ($present !== []) {
                Schema::table($tableName, fn (Blueprint $table) => $table->dropColumn($present));
            }
        }
    }
};
