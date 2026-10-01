<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * One transactional email, built from a saved template.
 *
 * Every email the shop sends is this class: the template decides the subject
 * and the wording, the view decides what sits under it, and the layout supplies
 * the branding. Adding an email is therefore a catalogue entry and a view, not
 * another Mailable.
 */
class TemplatedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array  $template  the resolved template — subject, heading, intro, outro, view
     * @param  array  $brand     the shop's identity, from EmailBrand::toArray()
     * @param  array  $payload   whatever the view needs (an order, an enquiry…)
     */
    public function __construct(
        public array $template,
        public array $brand,
        public array $payload = [],
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->template['subject']);
    }

    public function content(): Content
    {
        return new Content(
            view: $this->template['view'],
            with: [
                'heading' => $this->template['heading'],
                'intro'   => $this->template['intro'],
                'outro'   => $this->template['outro'],
                'brand'   => $this->brand,
            ] + $this->payload,
        );
    }
}
