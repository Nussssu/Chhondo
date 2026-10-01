<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The wording of each transactional email, so the shop can change what its
 * customers read without a deploy.
 *
 * Only the wording lives here: the layout, the order table and the branding are
 * the template's own, which keeps a badly edited field from producing a broken
 * email. A row is created the first time a template is saved; until then the
 * defaults on App\Models\EmailTemplate are used.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('subject');
            $table->string('heading')->nullable();
            $table->text('intro')->nullable();
            $table->text('outro')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_templates');
    }
};
