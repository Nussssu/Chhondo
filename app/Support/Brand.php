<?php

namespace App\Support;

/**
 * The store's name, Chhondo, wherever an older stored value still says
 * Charukothon / চারুকথন.
 *
 * Applied when a name is shown or sent, never when it is saved, so the stored
 * records stay as they are. Addresses, domains and handles are left alone —
 * "noreply@charukothon.com" is still the mailbox that works — which is why a
 * match next to ".", "@", "/" or "-" is skipped. Mirrors resources/js/utils/rebrand.js.
 */
class Brand
{
    public const NAME = 'Chhondo';

    public const NAME_BN = 'ছন্দ';

    public static function rebrand(?string $text): ?string
    {
        if ($text === null || $text === '') {
            return $text;
        }

        $text = preg_replace('/চিত্র\s*চারুকথন|চারুকথন/u', self::NAME_BN, $text);

        return preg_replace('/(?<![\w.@\/-])(?:chito\s+)?charuk(?:o|a)th?on(?![\w.@\/-])/iu', self::NAME, $text);
    }
}
