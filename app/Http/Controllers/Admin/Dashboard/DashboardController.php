<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Admin\Analytics\AnalyticsService;
use App\Services\Admin\OrderStatistics\OrderStatisticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $analyticsService;
    protected $OrderStatisticsService;

    public function __construct(OrderStatisticsService $OrderStatisticsService, AnalyticsService $analyticsService)
    {
        $this->OrderStatisticsService = $OrderStatisticsService;
        $this->analyticsService = $analyticsService;

    }

    public function index(Request $request)
    {
        $orderChartData = $this->OrderStatisticsService->orderChartData();

        $q = Order::query();
        $total_order     = (clone $q)->count();
        $pending_order   = (clone $q)->where('order_status', 'pending')->count();
        $processed_order = (clone $q)->where('order_status', 'processed')->count();
        $on_delivery     = (clone $q)->where('order_status', 'on delivery')->count();
        $shipped_order   = (clone $q)->where('order_status', 'shipped')->count();
        $incomplete_order = (clone $q)->where('order_status', 'incomplete')->count();
        $delivered_order = (clone $q)->where('order_status', 'delivered')->count();
        $cancelled_order = (clone $q)->where('order_status', 'cancelled')->count();
        $returned_order  = (clone $q)->where('order_status', 'returned')->count();

        return Inertia::render('Admin/Dashboard', [
            'orderChartData'  => $orderChartData,
            'total_order'     => $total_order,
            'pending_order'   => $pending_order,
            'processed_order' => $processed_order,
            'on_delivery'     => $on_delivery,
            'shipped_order'   => $shipped_order,
            'incomplete_order' => $incomplete_order,
            'delivered_order' => $delivered_order,
            'cancelled_order' => $cancelled_order,
            'returned_order'  => $returned_order,
        ]);
    }

    public function analytics(Request $request)
    {
        $range = $request->get('range', 1);
        $days = $request->get('days', 7);

        // Lightweight, cached metrics — this is all the 30s live-poll needs.
        $metrics = [
            'total_visitors' => $this->analyticsService->getTotalVisitors($range),
            'unique_visitors' => $this->analyticsService->getUniqueVisitors($range),
            'avg_session_duration' => $this->analyticsService->getAverageSessionDuration($range),
            'live_visitors' => $this->analyticsService->getLiveVisitors(),
            'visitor_trends' => $this->analyticsService->getVisitorTrends($days),
            'user_engagement' => $this->analyticsService->getUserEngagement($days),
        ];

        // The AJAX refresh polls every 30s — only return the live metrics.
        if ($request->ajax()) {
            return response()->json($metrics);
        }

        return Inertia::render('Admin/Analytics/Index', array_merge($metrics, [
            'most_active_pages' => $this->analyticsService->getMostActivePages($days),
        ]));
    }




}
