<?php

namespace App\Services\Mail;

use App\Models\Media;
use App\Models\SiteInfo;
use App\Models\SmtpSetting;
use Intervention\Image\Laravel\Facades\Image;
use Throwable;

/**
 * The shop's identity, as an email needs it.
 *
 * The logo is resolved to a file on disk, not a URL. An email is read long
 * after it was sent, often from a different network, and remote images are
 * blocked by default in most clients — so the file is attached to the message
 * and referenced by content id. Nothing in an email this produces depends on
 * the site being reachable, or on the address the site happens to be served
 * from today.
 */
class EmailBrand
{
    private ?SiteInfo $site;
    private ?Media $media;
    private ?SmtpSetting $smtp;

    public function __construct()
    {
        $this->site  = SiteInfo::first();
        $this->media = Media::first();
        $this->smtp  = SmtpSetting::first();
    }

    public function name(): string
    {
        return \App\Support\Brand::rebrand($this->site?->app_name
            ?: ($this->smtp?->email_from_name ?: config('app.name', 'Chhondo')));
    }

    public function phone(): ?string
    {
        return $this->site?->phone_number;
    }

    public function email(): ?string
    {
        return $this->smtp?->contact_email ?: $this->site?->store_email;
    }

    /** Where the shop's own copy of an order notification goes. */
    public function adminEmail(): ?string
    {
        return $this->smtp?->admin_email
            ?: ($this->smtp?->contact_email ?: $this->site?->store_email);
    }

    public function address(): ?string
    {
        return $this->site?->address;
    }

    /** The shop's accent colour, falling back to the palette the site ships. */
    public function colour(): string
    {
        $colour = trim((string) $this->site?->mainColor);

        return preg_match('/^#[0-9a-f]{3,8}$/i', $colour) ? $colour : '#2c5015';
    }

    /**
     * An absolute path to the logo file, or null when there is none to embed.
     *
     * The stored value is a web path (/storage/…, /assets/…), sometimes written
     * as a full URL by an older admin screen; only the path part is meaningful
     * here, and it is checked against the two directories images are served
     * from so a stored value can never point the mailer at an arbitrary file.
     */
    public function logoPath(): ?string
    {
        $value = $this->media?->logo;

        if (blank($value)) {
            return null;
        }

        if (preg_match('#^https?://#i', $value)) {
            $value = parse_url($value, PHP_URL_PATH) ?: '';
        }

        $relative = ltrim(rawurldecode((string) $value), '/');

        if ($relative === '') {
            return null;
        }

        // storage/* is served from the linked disk; everything else lives under
        // public/. realpath() resolves any ../ before the prefix is checked.
        $candidates = str_starts_with($relative, 'storage/')
            ? [storage_path('app/public/' . substr($relative, strlen('storage/'))), public_path($relative)]
            : [public_path($relative)];

        $roots = [realpath(public_path()), realpath(storage_path('app/public'))];

        foreach ($candidates as $candidate) {
            $real = realpath($candidate);

            if ($real === false || ! is_file($real)) {
                continue;
            }

            foreach (array_filter($roots) as $root) {
                if (str_starts_with($real, $root . DIRECTORY_SEPARATOR)) {
                    return $real;
                }
            }
        }

        return null;
    }

    /** Formats every mail client can draw. WebP is not one of them. */
    private const MAIL_SAFE = ['image/png', 'image/jpeg', 'image/gif'];

    /** The width the masthead draws the logo at, in CSS pixels. */
    public const LOGO_WIDTH = 96;

    /** The Chhondo logo for emails: 192px wide, twice LOGO_WIDTH. */
    private const CHHONDO_LOGO = 'assets/chhondo/logo-email.png';

    /**
     * The logo in a format every mail client can actually render.
     *
     * Uploads are stored as WebP — ImageUploadService re-encodes them — but
     * keep whatever name they were uploaded under, so this project ships a
     * WebP called logo.png. Neither the extension nor the stored path says
     * what the bytes are, so the file itself is inspected.
     *
     * That matters because Outlook on Windows, Yahoo Mail and older Apple Mail
     * cannot draw WebP at all: the masthead came out broken or blurred. A WebP
     * is therefore converted to PNG once and cached, at twice the width it is
     * displayed at so it stays sharp on high-density screens.
     */
    public function emailLogoPath(): ?string
    {
        // The Chhondo logo, as a PNG every mail client can draw (the site's
        // own logo is SVG, which they cannot). The uploaded logo is the
        // fallback only if this file is ever missing.
        $chhondo = public_path(self::CHHONDO_LOGO);
        if (is_file($chhondo)) {
            return $chhondo;
        }

        $source = $this->logoPath();

        if ($source === null) {
            return null;
        }

        if (in_array($this->mimeOf($source), self::MAIL_SAFE, true)) {
            return $source;
        }

        // Keyed on the file's identity, so replacing the logo in the admin
        // produces a new conversion rather than serving the old one forever.
        $key = substr(sha1($source . '|' . filemtime($source) . '|' . filesize($source)), 0, 16);
        $cached = storage_path('app/email-logos/' . $key . '.png');

        if (is_file($cached)) {
            return $cached;
        }

        try {
            if (! is_dir(dirname($cached))) {
                mkdir(dirname($cached), 0775, true);
            }

            // scaleDown never enlarges, so a logo smaller than this is left
            // alone rather than being blown up into a blurry one.
            Image::decodePath($source)
                ->scaleDown(width: self::LOGO_WIDTH * 2)
                ->save($cached);
        } catch (Throwable) {
            // A missing logo is a better masthead than a broken image.
            return null;
        }

        return is_file($cached) ? $cached : null;
    }

    /**
     * The height to draw the logo at, for its width.
     *
     * Outlook renders through Word, which sizes an image from its width and
     * height attributes and falls back to the file's own dimensions when the
     * height is missing — so without this the 2x file would be drawn at twice
     * its intended size. Null when the dimensions cannot be read, in which
     * case the view omits the attribute rather than guessing.
     */
    public function logoHeight(): ?int
    {
        $path = $this->emailLogoPath();

        if ($path === null) {
            return null;
        }

        $size = @getimagesize($path);

        if ($size === false || (int) $size[0] === 0) {
            return null;
        }

        return (int) round(self::LOGO_WIDTH * $size[1] / $size[0]);
    }

    /** What a file actually contains, rather than what it is named. */
    private function mimeOf(string $path): string
    {
        // SVG is text, so finfo reports it as XML or plain text; the extension
        // is the only reliable signal for it.
        if (strtolower(pathinfo($path, PATHINFO_EXTENSION)) === 'svg') {
            return 'image/svg+xml';
        }

        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($path);

        return is_string($mime) && $mime !== '' ? $mime : 'application/octet-stream';
    }

    /**
     * The logo as a data: URI, for previewing a template in the browser where
     * there is no message to attach it to.
     *
     * Uses the same converted file the email gets, so the preview shows what
     * will actually be sent, and labels it by what the bytes are rather than
     * by the file's name.
     */
    public function logoDataUri(): ?string
    {
        $path = $this->emailLogoPath();

        if ($path === null) {
            return null;
        }

        return 'data:' . $this->mimeOf($path) . ';base64,' . base64_encode((string) file_get_contents($path));
    }

    /** Everything a mail view needs about the shop, in one array. */
    public function toArray(): array
    {
        return [
            'name'        => $this->name(),
            'phone'       => $this->phone(),
            'email'       => $this->email(),
            'address'     => $this->address(),
            'colour'      => $this->colour(),
            'logoPath'    => $this->emailLogoPath(),
            'logoWidth'   => self::LOGO_WIDTH,
            'logoHeight'  => $this->logoHeight(),
            'logoDataUri' => $this->logoDataUri(),
            'year'        => date('Y'),
        ];
    }
}
