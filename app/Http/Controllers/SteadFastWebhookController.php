<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\SiteInfo;
use Illuminate\Http\Request;

class SteadFastWebhookController extends Controller
{
    public function handleSteadFastWebhook(Request $request)
    {
        $permission=SiteInfo::first();
        if(!$permission){
            return;
        }
        if(!$permission->steadfast_webhook){
            return;
        }
        $payload = $request->all();

        // The token used to be read as env('STEADFAST_BEARER_TOKEN ') — note the
        // trailing space — which never matched a variable, so every call was
        // refused. A token that is not configured must refuse every call too,
        // rather than letting an empty bearer through.
        $expected = (string) config('services.steadfast.webhook_token');
        $given    = (string) $request->bearerToken();

        if ($expected === '' || ! hash_equals($expected, $given)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $this->validatePayload($payload);
            $this->processPayload($payload);

            return response()->json(['status' => 'success'], 200);
        } catch (\Throwable $th) {
            return response()->json(
                ['error' => \App\Helpers\SafeError::message($th, 'Webhook could not be processed.', 'Steadfast webhook failed')],
                400
            );
        }


        return response()->json(['message' => 'Webhook received'], 200);
    }

    private function validatePayload($payload)
    {
        $properties = [
            'consignment_id',
            'invoice',
            'status',
            'cod_amount',
            'updated_at',
        ];
        $missingProperties = array_diff($properties, array_keys($payload));
        if ($missingProperties) {
            abort(400, 'Missing required properties: ' . implode(', ', $missingProperties));
        }
    }

    private function processPayload($payload)
    {
        $consignment_id = $payload['consignment_id'];
        $orderStatus = $payload['status'];
        $invoice = $payload['invoice'];

        $order = Order::where('invoice_number', $invoice)->where('consignment_id', $consignment_id)->first();

        if ($order) {
            switch ($orderStatus) {
                case 'delivered':
                    $order->order_status = 'delivered';
                    break;
                case 'partial_delivered':
                    $order->order_status = 'shipped';

                    break;
                case 'cancelled':
                    $order->order_status = 'cancelled';

                    break;
            }

            $order->save();
        }
    }
}
