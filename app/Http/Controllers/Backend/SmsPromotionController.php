<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Jobs\SmsPromotionJob;
use App\Models\Category;
use App\Models\Product;
use App\Models\PromotionalSms;
use App\Models\User;
use App\Models\UserSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SmsPromotionController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('name', 'asc')->get();
        $users = User::orderBy('name', 'asc')->get();
        $products = Product::orderBy('product_name', 'asc')->get();
        $promotions = PromotionalSms::latest()->paginate(20);
        return Inertia::render('Admin/Promotion/Sms/Index', [
            'categories' => $categories,
            'users'      => $users,
            'products'   => $products,
            'promotions' => $promotions,
        ]);
    }

    public function send(Request $request)
    {
        $promotion = PromotionalSms::create([
            'campaign_title' => $request->campaign_name,
            'category'       => $request->target_type,
            'sms'            => $request->message,
            'numbers'        => [],
            'status'         => 'pending',
        ]);

        // dispatch job with only id, job will process recipients
        SmsPromotionJob::dispatch($promotion->id, $request->all());

        return response()->json([
            'status'  => true,
            'message' => 'Message queued successfully.',
        ]);
    }

}
