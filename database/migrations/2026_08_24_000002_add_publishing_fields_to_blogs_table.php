<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Blog posts had no URL key and no publish state, so they could only ever live
 * inside the admin. Adds a slug (the public URL), a status and a publish date.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
            $table->string('status')->default('Published')->after('slug');
            $table->timestamp('published_at')->nullable()->after('status');
        });

        foreach (DB::table('blogs')->get() as $blog) {
            $slug = Str::slug($blog->title) ?: 'post';
            $base = $slug;
            $i    = 2;

            while (DB::table('blogs')->where('slug', $slug)->where('id', '!=', $blog->id)->exists()) {
                $slug = $base . '-' . $i++;
            }

            DB::table('blogs')->where('id', $blog->id)->update([
                'slug'         => $slug,
                'status'       => 'Published',
                'published_at' => $blog->created_at,
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            // The unique index has to go first: SQLite cannot drop a column
            // that an index still references.
            $table->dropUnique('blogs_slug_unique');
        });

        Schema::table('blogs', function (Blueprint $table) {
            $table->dropColumn(['slug', 'status', 'published_at']);
        });
    }
};
