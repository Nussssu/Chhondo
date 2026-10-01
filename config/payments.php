<?php

return [

    /*
    |--------------------------------------------------------------------------
    | How an order was paid
    |--------------------------------------------------------------------------
    |
    | Kept in config rather than a database table because these are the shapes
    | of payment the shop accepts, not records it manages. Both the POS screen
    | and the order validation read from here, so adding a provider is a
    | one-line change that cannot leave the two out of step.
    |
    */

    'types' => [
        'cash'   => 'Cash',
        'cod'    => 'Cash on delivery',
        'online' => 'Online payment',
    ],

    /*
    | Only offered when the payment type is "online". Grouped so the till can
    | show mobile wallets — overwhelmingly the common case in Bangladesh —
    | ahead of cards and bank transfers.
    */
    'methods' => [
        'bkash'    => ['label' => 'bKash',         'group' => 'Mobile wallet'],
        'nagad'    => ['label' => 'Nagad',         'group' => 'Mobile wallet'],
        'rocket'   => ['label' => 'Rocket',        'group' => 'Mobile wallet'],
        'upay'     => ['label' => 'Upay',          'group' => 'Mobile wallet'],
        'mcash'    => ['label' => 'mCash',         'group' => 'Mobile wallet'],
        'surecash' => ['label' => 'SureCash',      'group' => 'Mobile wallet'],
        'tap'      => ['label' => 'Tap',           'group' => 'Mobile wallet'],
        'card'     => ['label' => 'Card',          'group' => 'Card & bank'],
        'bank'     => ['label' => 'Bank transfer', 'group' => 'Card & bank'],
        'cheque'   => ['label' => 'Cheque',        'group' => 'Card & bank'],
    ],

];
