<?php

namespace App\Services\Admin\Pages;

/**
 * Turns the widget list from the page editor into the HTML the storefront
 * renders. `content` remains the single source of truth for the public pages,
 * so nothing on the storefront had to change to support block editing.
 */
class PageBlockRenderer
{
    /** Widget types the editor offers. Anything else is ignored on save. */
    public const TYPES = ['heading', 'text', 'image', 'image_text', 'video', 'video_strip', 'gallery', 'cta_banner', 'feature_cards', 'product_section', 'html'];

    /**
     * Widgets whose content is pulled live (products, and video embeds that the
     * storefront builds its own player for). They are rendered by the page
     * itself, not baked into the saved HTML.
     */
    public const DYNAMIC_TYPES = ['video', 'video_strip', 'gallery', 'cta_banner', 'feature_cards', 'product_section'];

    public function render(array $blocks): string
    {
        $out = [];

        foreach ($blocks as $block) {
            // Switched off in the editor: not part of the page.
            if (! empty($block['hidden'])) {
                continue;
            }

            $type = $block['type'] ?? null;

            if (! in_array($type, self::TYPES, true)) {
                continue;
            }

            // Dynamic widgets are resolved per request; nothing to bake in.
            if (in_array($type, self::DYNAMIC_TYPES, true)) {
                continue;
            }

            $html = match ($type) {
                'heading'    => $this->heading($block),
                'text'       => trim((string) ($block['html'] ?? '')),
                'image'      => $this->image($block),
                'image_text' => $this->imageText($block),
                'html'       => trim((string) ($block['code'] ?? '')),
            };

            if (trim($html) !== '') {
                $out[] = $html;
            }
        }

        return implode("\n\n", $out);
    }

    private function heading(array $block): string
    {
        $text = trim((string) ($block['text'] ?? ''));

        if ($text === '') {
            return '';
        }

        $level = (int) ($block['level'] ?? 2);
        $level = in_array($level, [1, 2, 3], true) ? $level : 2;

        return sprintf('<h%d>%s</h%d>', $level, e($text), $level);
    }

    private function image(array $block): string
    {
        $url = trim((string) ($block['url'] ?? ''));

        if ($url === '') {
            return '';
        }

        $img = sprintf('<img src="%s" alt="%s">', e($url), e((string) ($block['alt'] ?? '')));
        $caption = trim((string) ($block['caption'] ?? ''));

        return $caption === ''
            ? "<figure>{$img}</figure>"
            : "<figure>{$img}<figcaption>" . e($caption) . '</figcaption></figure>';
    }

    private function imageText(array $block): string
    {
        $url  = trim((string) ($block['url'] ?? ''));
        $html = trim((string) ($block['html'] ?? ''));

        if ($url === '' && $html === '') {
            return '';
        }

        $side = ($block['position'] ?? 'left') === 'right' ? 'right' : 'left';

        $media = $url === ''
            ? ''
            : sprintf('<div class="page-split-media"><img src="%s" alt="%s"></div>', e($url), e((string) ($block['alt'] ?? '')));

        $body = sprintf('<div class="page-split-body">%s</div>', $html);

        $inner = $side === 'right' ? $body . $media : $media . $body;

        return sprintf('<div class="page-split page-split--%s">%s</div>', $side, $inner);
    }

    /** Tags kept verbatim in an HTML widget — a rich-text editor would mangle them. */
    private const OPAQUE_TAGS = ['script', 'style', 'iframe', 'noscript', 'form', 'svg', 'video', 'audio'];

    /** Wrappers that only ever carried styling; their children are kept, they are not. */
    private const UNWRAP_TAGS = ['span', 'font'];

    /** Attributes worth keeping. Everything else is layout noise from the source document. */
    private const KEEP_ATTRS = [
        'a'   => ['href', 'target', 'rel'],
        'img' => ['src', 'alt', 'width', 'height'],
        'td'  => ['colspan', 'rowspan'],
        'th'  => ['colspan', 'rowspan'],
    ];

    /** Longest a bold paragraph can be and still read as a section heading. */
    private const HEADING_MAX_CHARS = 120;

    /**
     * Existing pages were written as one HTML blob, which the editor could only
     * show as a raw <textarea> of markup. Splitting it into real widgets is what
     * makes those pages editable by someone who does not write HTML.
     *
     * The split is a read-time convenience: nothing is persisted until the page
     * is saved, so `content` stays untouched until an editor commits to it.
     */
    public function blocksFromContent(?string $content): array
    {
        $content = trim((string) $content);

        if ($content === '') {
            return [];
        }

        $blocks = $this->splitHtml($content);

        // A blob we cannot make sense of is still editable as one HTML widget —
        // better a code box than silently dropping someone's page.
        return $blocks === [] ? [$this->htmlBlock($content, 'legacy')] : $blocks;
    }

    /**
     * Walk the top level of the blob and emit one widget per section: headings
     * become Heading widgets, standalone images become Image widgets, and the
     * prose between them is gathered into rich-text widgets.
     */
    private function splitHtml(string $content): array
    {
        $doc = $this->parse($content);

        if (! $doc) {
            return [];
        }

        $root = $doc->getElementById('pbr-root');

        if (! $root) {
            return [];
        }

        // A single wrapper element around the whole page is a container, not
        // content — descend through it so its children are what we split on.
        while ($only = $this->soleElementChild($root)) {
            $root = $only;
        }

        $blocks = [];
        $buffer = '';
        $index  = 0;

        // Prose accumulates until a heading or image interrupts it, so a run of
        // paragraphs and lists stays in one rich-text widget rather than becoming
        // one widget per tag.
        $flush = function () use (&$blocks, &$buffer, &$index) {
            $html   = trim($buffer);
            $buffer = '';

            if ($html === '' || (trim(strip_tags($html)) === '' && ! str_contains($html, '<img'))) {
                return;
            }

            $blocks[] = ['id' => 'legacy-' . $index++, 'type' => 'text', 'html' => $html];
        };

        foreach (iterator_to_array($root->childNodes) as $node) {
            if (! $node instanceof \DOMElement) {
                continue;
            }

            $tag = strtolower($node->tagName);

            if (in_array($tag, self::OPAQUE_TAGS, true)) {
                $flush();
                $blocks[] = $this->htmlBlock(trim($doc->saveHTML($node)), 'legacy-' . $index++);
                continue;
            }

            if ($heading = $this->headingText($node)) {
                $flush();
                $blocks[] = [
                    'id'    => 'legacy-' . $index++,
                    'type'  => 'heading',
                    'text'  => $heading['text'],
                    'level' => $heading['level'],
                ];
                continue;
            }

            if ($image = $this->imageOnly($node)) {
                $flush();
                $blocks[] = [
                    'id'      => 'legacy-' . $index++,
                    'type'    => 'image',
                    'url'     => $image->getAttribute('src'),
                    'alt'     => $image->getAttribute('alt'),
                    'caption' => '',
                ];
                continue;
            }

            // An empty spacer paragraph is layout, not copy.
            if (trim($node->textContent) === '' && $node->getElementsByTagName('img')->length === 0) {
                continue;
            }

            $buffer .= $this->cleanedHtml($node, $doc);
        }

        $flush();

        return $blocks;
    }

    private function parse(string $content): ?\DOMDocument
    {
        $doc = new \DOMDocument();

        // Without the encoding hint libxml reads the bytes as Latin-1 and the
        // Bengali copy comes back as mojibake.
        $previous = libxml_use_internal_errors(true);
        $loaded   = $doc->loadHTML(
            '<?xml encoding="utf-8" ?><div id="pbr-root">' . $content . '</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        return $loaded ? $doc : null;
    }

    /** The one element child of a node, when it is the only thing the node holds. */
    private function soleElementChild(\DOMElement $node): ?\DOMElement
    {
        $found = null;

        foreach ($node->childNodes as $child) {
            if ($child instanceof \DOMText && trim($child->textContent) !== '') {
                return null;
            }

            if ($child instanceof \DOMElement) {
                if ($found !== null) {
                    return null;
                }

                $found = $child;
            }
        }

        if (! $found || ! in_array(strtolower($found->tagName), ['div', 'section', 'article', 'main', 'span'], true)) {
            return null;
        }

        // Only a wrapper if it holds blocks. A <span> around a sentence is content.
        foreach ($found->childNodes as $child) {
            if ($child instanceof \DOMElement) {
                return $found;
            }
        }

        return null;
    }

    /**
     * The heading this node represents, if it is one.
     *
     * A real <h1>-<h6> is obvious. The harder case is copy pasted from a word
     * processor, which has no headings at all — there, a short paragraph whose
     * every word is bold is what a reader sees as a section title.
     */
    private function headingText(\DOMElement $node): ?array
    {
        $text = trim(preg_replace('/\s+/u', ' ', $node->textContent));

        if ($text === '') {
            return null;
        }

        if (preg_match('/^h([1-6])$/', strtolower($node->tagName), $m)) {
            // The editor only offers H1-H3; deeper headings sit at H3.
            return ['text' => $text, 'level' => min((int) $m[1], 3)];
        }

        if (! in_array(strtolower($node->tagName), ['p', 'div'], true)) {
            return null;
        }

        if (mb_strlen($text) > self::HEADING_MAX_CHARS) {
            return null;
        }

        // A heading is one line. A bold lead-in on a long paragraph is not.
        if ($node->getElementsByTagName('br')->length > 0 || $node->getElementsByTagName('img')->length > 0) {
            return null;
        }

        return $this->isAllBold($node, $text) ? ['text' => $text, 'level' => 2] : null;
    }

    /** Whether every visible character in the node is emboldened. */
    private function isAllBold(\DOMElement $node, string $text): bool
    {
        $bold = '';

        foreach ($node->getElementsByTagName('*') as $child) {
            if (in_array(strtolower($child->tagName), ['b', 'strong'], true)
                || preg_match('/font-weight\s*:\s*(bold|[6-9]00)/i', $child->getAttribute('style'))) {
                $bold .= $child->textContent;
            }
        }

        $bold = trim(preg_replace('/\s+/u', ' ', $bold));

        return $bold !== '' && $bold === $text;
    }

    /**
     * The node's markup with the word-processor styling stripped out, so the copy
     * opens in the rich-text editor as editable prose rather than a wall of tags.
     *
     * A node that is itself only a styling wrapper contributes its children —
     * cleaning it in place would delete the very node we are serialising.
     */
    private function cleanedHtml(\DOMElement $node, \DOMDocument $doc): string
    {
        $this->clean($node);

        if (! in_array(strtolower($node->tagName), self::UNWRAP_TAGS, true)) {
            return $doc->saveHTML($node);
        }

        $html = '';

        foreach ($node->childNodes as $child) {
            $html .= $doc->saveHTML($child);
        }

        return $html;
    }

    /**
     * Recursively drop styling attributes and unwrap styling-only tags.
     *
     * $isRoot marks the node the caller still holds a reference to: it keeps its
     * tag, because removing it here would leave the caller with a detached node.
     */
    private function clean(\DOMElement $node, bool $isRoot = true): void
    {
        foreach (iterator_to_array($node->childNodes) as $child) {
            if ($child instanceof \DOMElement) {
                $this->clean($child, false);
            }
        }

        foreach (iterator_to_array($node->attributes ?? []) as $attr) {
            $keep = self::KEEP_ATTRS[strtolower($node->tagName)] ?? [];

            if (! in_array(strtolower($attr->name), $keep, true)) {
                $node->removeAttribute($attr->name);
            }
        }

        // Done after the attribute sweep so an unwrapped span leaves nothing behind.
        if (! $isRoot && in_array(strtolower($node->tagName), self::UNWRAP_TAGS, true) && $node->parentNode) {
            while ($node->firstChild) {
                $node->parentNode->insertBefore($node->firstChild, $node);
            }

            $node->parentNode->removeChild($node);
        }
    }

    /**
     * The <img> this node exists only to carry, if that is all it holds — a bare
     * <img>, or the <p>/<figure>/<div> wrapper an editor left around one.
     */
    private function imageOnly(\DOMElement $node): ?\DOMElement
    {
        if (strtolower($node->tagName) === 'img') {
            return $node->hasAttribute('src') ? $node : null;
        }

        if (! in_array(strtolower($node->tagName), ['p', 'figure', 'div'], true)) {
            return null;
        }

        if (trim($node->textContent) !== '') {
            return null;
        }

        $images = $node->getElementsByTagName('img');

        return $images->length === 1 && $images->item(0)->hasAttribute('src')
            ? $images->item(0)
            : null;
    }

    private function htmlBlock(string $code, string $id): array
    {
        return ['id' => $id, 'type' => 'html', 'code' => $code];
    }
}