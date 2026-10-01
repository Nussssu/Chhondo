<?php

namespace App\Support;

/**
 * Matching Bangla product names against Banglish typed on a Latin keyboard.
 *
 * Products are named in Bangla — "শাড়ি", "পাঞ্জাবি" — but shoppers search by
 * typing the sound of the word in Latin letters, and no two people spell it the
 * same way: শাড়ি is typed shari, saree, sari, shaari. A LIKE against the stored
 * name matches none of them.
 *
 * So both sides are reduced to the same deliberately lossy phonetic key:
 * Bangla is transliterated to Latin, then that Latin — and whatever the shopper
 * typed — is folded down until the spellings people actually disagree about
 * collapse together. "শাড়ি", "saree" and "shari" all reduce to "sari".
 *
 * The folding is one-way and only ever used for matching; nothing is displayed
 * from it.
 */
class Banglish
{
    /**
     * Independent vowels — the forms written at the start of a syllable.
     */
    private const VOWELS = [
        'অ' => 'a',  'আ' => 'a',  'ই' => 'i',  'ঈ' => 'i',  'উ' => 'u',
        'ঊ' => 'u',  'ঋ' => 'ri', 'এ' => 'e',  'ঐ' => 'oi', 'ও' => 'o',
        'ঔ' => 'ou',
    ];

    /**
     * Vowel signs — the same vowels written as marks on a consonant.
     */
    private const MATRAS = [
        'া' => 'a',  'ি' => 'i',  'ী' => 'i',  'ু' => 'u',  'ূ' => 'u',
        'ৃ' => 'ri', 'ে' => 'e',  'ৈ' => 'oi', 'ো' => 'o',  'ৌ' => 'ou',
    ];

    private const CONSONANTS = [
        'ক' => 'k',  'খ' => 'kh', 'গ' => 'g',  'ঘ' => 'gh', 'ঙ' => 'ng',
        'চ' => 'ch', 'ছ' => 'chh','জ' => 'j',  'ঝ' => 'jh', 'ঞ' => 'n',
        'ট' => 't',  'ঠ' => 'th', 'ড' => 'd',  'ঢ' => 'dh', 'ণ' => 'n',
        'ত' => 't',  'থ' => 'th', 'দ' => 'd',  'ধ' => 'dh', 'ন' => 'n',
        'প' => 'p',  'ফ' => 'ph', 'ব' => 'b',  'ভ' => 'bh', 'ম' => 'm',
        'য' => 'j',  'র' => 'r',  'ল' => 'l',  'শ' => 'sh', 'ষ' => 'sh',
        'স' => 's',  'হ' => 'h',  'ড়' => 'r',  'ঢ়' => 'rh', 'য়' => 'y',
        'ৎ' => 't',
    ];

    /** Marks that add a nasal or an aspirate rather than a syllable. */
    private const SIGNS = [
        'ং' => 'ng', 'ঃ' => 'h', 'ঁ' => '',
    ];

    private const DIGITS = [
        '০' => '0', '১' => '1', '২' => '2', '৩' => '3', '৪' => '4',
        '৫' => '5', '৬' => '6', '৭' => '7', '৮' => '8', '৯' => '9',
    ];

    /** Virama: silences the vowel a consonant otherwise carries. */
    private const HASANTA = '্';

    /** The nukta, which turns a base consonant into a different sound. */
    private const NUKTA = "\u{09BC}";

    /**
     * ড়, ঢ় and য় exist both precomposed (U+09DC…) and as a base letter plus a
     * nukta, and editors and copy-paste produce either. Both are handled by
     * codepoint rather than by a literal in this file, because a literal here
     * would itself be stored in one form or the other and only match that one —
     * which is why শাড়ি first transliterated as "shada".
     */
    private const PRECOMPOSED = [
        "\u{09DC}" => "\u{09A1}\u{09BC}",
        "\u{09DD}" => "\u{09A2}\u{09BC}",
        "\u{09DF}" => "\u{09AF}\u{09BC}",
    ];

    /** What a base consonant becomes once it carries a nukta. */
    private const NUKTA_SOUNDS = [
        "\u{09A1}" => 'r',   // ড় — a flapped r, not a d
        "\u{09A2}" => 'rh',  // ঢ়
        "\u{09AF}" => 'y',   // য়
    ];

    /**
     * Spellings people disagree about, folded together. Applied to Latin,
     * whether it came from a Bangla name or from the search box.
     *
     * Longest match wins (strtr), so 'chh' is consumed before 'ch'.
     */
    /**
     * Vowel length, folded before doubled letters are collapsed — "ee" has to
     * become "i" while it is still a pair.
     */
    private const VOWEL_FOLDS = [
        'ee' => 'i', 'ii' => 'i', 'oo' => 'u', 'uu' => 'u', 'aa' => 'a',
        'ou' => 'o', 'au' => 'o', 'oi' => 'o', 'ai' => 'o',
        // English loanwords keep their English spelling as often as not:
        // "three piece" for থ্রি পিস.
        'ie' => 'i',
    ];

    /**
     * Consonant spellings people disagree about, folded after doubled letters
     * are collapsed. Longest match wins (strtr), so 'chh' goes before 'ch'.
     */
    private const DIGRAPHS = [
        'chh' => 'c', 'ch' => 'c',
        'kh' => 'k', 'gh' => 'g', 'jh' => 'j',
        'th' => 't', 'dh' => 'd', 'bh' => 'b',
        'ph' => 'f', 'sh' => 's', 'ss' => 's',
        'ng' => 'n', 'rh' => 'r',
        'ce' => 's', 'ck' => 'k',
    ];

    /** Single letters that stand for the same sound. */
    private const LETTERS = [
        'z' => 'j', 'v' => 'b', 'w' => 'b', 'q' => 'k', 'x' => 'k',
        'y' => 'i', 'f' => 'f',
        // Bangla's inherent vowel is heard between "o" and "a" and is written
        // both ways — কলম is typed kolom and kalam with equal confidence.
        'o' => 'a',
    ];

    /**
     * Bangla to a rough Latin spelling.
     *
     * Text that is already Latin passes through untouched, so this is safe to
     * run over a mixed name like "Silk শাড়ি".
     */
    public static function transliterate(string $text): string
    {
        // One representation from here on: everything decomposed.
        $text = strtr($text, self::PRECOMPOSED);

        $characters = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $out = '';
        $count = count($characters);

        for ($i = 0; $i < $count; $i++) {
            $char = $characters[$i];

            if (isset(self::CONSONANTS[$char])) {
                // A nukta on this consonant changes the sound outright.
                if (($characters[$i + 1] ?? null) === self::NUKTA) {
                    $out .= self::NUKTA_SOUNDS[$char] ?? self::CONSONANTS[$char];
                    $i++;
                } else {
                    $out .= self::CONSONANTS[$char];
                }

                $next = $characters[$i + 1] ?? null;

                // A matra or a virama says what follows the consonant. With
                // neither, the consonant carries Bangla's inherent vowel —
                // except at the end of a word, where it falls silent: কলম is
                // "kalam", not "kalama".
                if ($next !== null && isset(self::MATRAS[$next])) {
                    $out .= self::MATRAS[$next];
                    $i++;
                } elseif ($next === self::HASANTA) {
                    $i++;
                } elseif ($next !== null && ! self::endsSyllable($next)) {
                    $out .= 'a';
                }

                continue;
            }

            $out .= self::VOWELS[$char]
                ?? self::MATRAS[$char]
                ?? self::SIGNS[$char]
                ?? self::DIGITS[$char]
                ?? $char;
        }

        return $out;
    }

    /**
     * The phonetic key used for matching.
     *
     * Accepts Bangla, Latin or a mix, and reduces all three to the same space.
     */
    public static function key(string $text): string
    {
        $text = self::transliterate($text);
        $text = mb_strtolower($text, 'UTF-8');
        $text = self::foldAccents($text);

        // Only letters and digits carry sound; spaces and punctuation go, so
        // "শাড়ি-কালেকশন" and "shari collection" line up.
        $text = preg_replace('/[^a-z0-9]+/u', '', $text) ?? '';

        // Vowel length first, while a long vowel is still a doubled letter:
        // "saree" has to reach "sari" before the pass below turns "ee" into a
        // single "e" and the length is lost.
        $text = strtr($text, self::VOWEL_FOLDS);

        // Then doubled letters. A conjunct such as ঙ্গ transliterates to "ngg",
        // and folding digraphs before this would consume the "ng" and leave a
        // stray "g" — লেহেঙ্গা keyed as "lehenga" while the shopper's "lehenga"
        // keyed as "lehena", and the two never met.
        $text = self::dedupe($text);

        // Digraphs before single letters: 'sh' has to become 's' before the
        // 'h' can be considered on its own.
        $text = strtr($text, self::DIGRAPHS);
        $text = strtr($text, self::LETTERS);

        // Bangla's inherent vowel is written in Latin as "a" or "o", or left
        // out entirely, and which of those a speaker uses is not predictable
        // from the spelling: বোরকা is "borka", not the "boroka" the script
        // literally spells. Dropping the sound is the only way both reach the
        // same key. Every other vowel is written deliberately and is kept.
        $text = str_replace('a', '', $text);

        return self::dedupe($text);
    }

    /** Latin letters carrying diacritics, reduced to the plain letter. */
    private static function foldAccents(string $text): string
    {
        return strtr($text, [
            'ñ' => 'n', 'á' => 'a', 'à' => 'a', 'â' => 'a', 'ä' => 'a',
            'é' => 'e', 'è' => 'e', 'ê' => 'e', 'í' => 'i', 'ì' => 'i',
            'ó' => 'o', 'ò' => 'o', 'ô' => 'o', 'ú' => 'u', 'ù' => 'u',
            'ü' => 'u', 'ç' => 'c',
        ]);
    }

    /** Runs of the same letter reduced to one: "sarri" and "sari" are one word. */
    private static function dedupe(string $text): string
    {
        return preg_replace('/(.)\1+/u', '$1', $text) ?? '';
    }

    /**
     * A key for every word plus one for the whole phrase, space separated.
     *
     * Storing the words individually is what lets a search for one word in a
     * long name match it, while the joined form still matches a shopper who
     * typed the name without spaces.
     */
    public static function indexKey(string $text): string
    {
        $words = preg_split('/\s+/u', trim($text), -1, PREG_SPLIT_NO_EMPTY) ?: [];

        $keys = [];

        foreach ($words as $word) {
            $key = self::key($word);

            if ($key !== '') {
                $keys[] = $key;
            }
        }

        $joined = implode('', $keys);

        if ($joined !== '' && count($keys) > 1) {
            $keys[] = $joined;
        }

        return implode(' ', array_unique($keys));
    }

    /** Whether a character closes the syllable, leaving no inherent vowel. */
    private static function endsSyllable(string $char): bool
    {
        return isset(self::MATRAS[$char])
            || $char === self::HASANTA
            || isset(self::SIGNS[$char]);
    }
}
