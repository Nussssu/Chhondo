# Checkout confirmation worker

Order creation, pricing, stock checks and payment redirects stay synchronous.
Cash-on-delivery SMS and email confirmations run on the dedicated database queue
`order-confirmations`, so external delivery services do not delay the success page.

Keep this worker running in each deployed environment (using the existing process
manager). It does not consume other queues:

```sh
php artisan queue:work database --queue=order-confirmations --sleep=1 --tries=1 --timeout=80
```

Use the PHP version required by this project (8.4 or newer). Restart the managed
worker after deploying application code. The local worker was started separately;
it needs to be started again after a machine restart.

Existing notifier error logging and best-effort sending are unchanged. No old
orders are re-enqueued, and notification failure must not invalidate a saved order.
