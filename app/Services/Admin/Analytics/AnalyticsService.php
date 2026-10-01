<?php

namespace App\Services\Admin\Analytics;

use App\Models\Order;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AnalyticsService
{
    /**
     * Get total number of users/visitors for the given time period
     */
    public function getTotalVisitors($months)
    {
        $cacheKey = 'total_visitors_' . $months;

        return Cache::remember($cacheKey, 60, function () use ($months) {
            return User::where('created_at', '>=', Carbon::now()->subMonths($months))
                      ->count();
        });
    }

    /**
     * Get unique visitors based on email addresses
     */
    public function getUniqueVisitors($months)
    {
        $cacheKey = 'unique_visitors_' . $months;

        return Cache::remember($cacheKey, 60, function () use ($months) {
            return User::where('created_at', '>=', Carbon::now()->subMonths($months))
                      ->whereNotNull('email')
                      ->distinct('email')
                      ->count();
        });
    }

    /**
     * The session window the old duration arithmetic collapsed to (30 minutes).
     * See getAverageSessionDuration() for why this is not a measured value.
     */
    private const SESSION_WINDOW_SECONDS = 1800;

    /** Driver-portable "unix timestamp column -> Y-m-d" expression. */
    private function dateFromTimestampSql(string $column): string
    {
        return match (DB::connection()->getDriverName()) {
            'sqlite' => "date({$column}, 'unixepoch')",
            'pgsql' => "to_char(to_timestamp({$column}), 'YYYY-MM-DD')",
            default => "DATE(FROM_UNIXTIME({$column}))",
        };
    }

    /**
     * Calculate average session duration
     */
    public function getAverageSessionDuration($months)
    {
        $cacheKey = 'avg_session_' . $months;

        return Cache::remember($cacheKey, 60, function () use ($months) {
            $now = Carbon::now();

            // NOTE: this metric cannot be derived from the data available. The sessions
            // table records only `last_activity`, with no session start, so there is
            // nothing to subtract. The previous query computed
            // AVG(TIMESTAMPDIFF(SECOND, last_activity - 1800, last_activity)), which is
            // identically 1800 for every row: it always reported "30m 0s" while looking
            // like a real calculation, and used MySQL-only functions that made the whole
            // analytics page fail on any other driver.
            //
            // The reported number is unchanged on purpose, but the code no longer
            // pretends to measure. Measuring this properly needs a session-start column
            // or a dedicated analytics tool.
            $avgDuration = DB::table('sessions')
                ->where('last_activity', '>=', $now->subMonths($months)->timestamp)
                ->exists() ? self::SESSION_WINDOW_SECONDS : 0;

            if (!$avgDuration || $avgDuration <= 0) {
                return '0m 0s';
            }

            $minutes = floor($avgDuration / 60);
            $seconds = round($avgDuration % 60);

            return "{$minutes}m {$seconds}s";
        });
    }



    /**
     * Get current number of active users
     */
    public function getLiveVisitors()
    {

        $cacheKey = 'live_visitors';

        return Cache::remember($cacheKey, 1, function () {
            return DB::table('sessions')
                ->where('last_activity', '>=', Carbon::now()->subMinutes(5)->timestamp)
                ->count();
        });

    }
    /**
     * Get visitor trends over time
     */
    public function getVisitorTrends($days)
    {
        $cacheKey = 'visitor_trends_' . $days;

        return Cache::remember($cacheKey, 60, function () use ($days) {
            $data = DB::table('sessions')
                ->select([
                    DB::raw($this->dateFromTimestampSql('last_activity') . ' as date'),
                    DB::raw('COUNT(DISTINCT id) as total'),
                    DB::raw('COUNT(DISTINCT user_id) as unique_visitors')
                ])
                ->where('last_activity', '>=', Carbon::now()->subDays($days)->timestamp)
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Return plain arrays (not Collections) so the cached value
            // serializes cleanly to JSON — a cached Collection comes back as a
            // __PHP_Incomplete_Class and breaks the Inertia payload.
            return [
                'labels' => $data->pluck('date')->map(function ($date) {
                    return Carbon::parse($date)->format('M d');
                })->values()->all(),
                'total' => $data->pluck('total')->values()->all(),
                'unique' => $data->pluck('unique_visitors')->values()->all(),
            ];
        });
    }

    /**
     * Get user engagement statistics
     */
    public function getUserEngagement($days)
    {
        $cacheKey = 'user_engagement_' . $days;

        return Cache::remember($cacheKey, 60, function () use ($days) {
            $rows = DB::table('sessions')
                ->where('last_activity', '>=', Carbon::now()->subDays($days)->timestamp)
                ->count();

            // Same non-measurement as getAverageSessionDuration(): every row's
            // "duration" evaluated to exactly 1800 seconds, so the CASE always chose
            // the final branch and the histogram was a single bucket. Bucketing happens
            // here now, with the same outcome and no MySQL-only SQL.
            $bucket = self::SESSION_WINDOW_SECONDS < 60 ? '0-1m'
                : (self::SESSION_WINDOW_SECONDS < 300 ? '1-5m'
                : (self::SESSION_WINDOW_SECONDS < 600 ? '5-10m' : '10m+'));

            return $rows === 0 ? [] : [['duration_range' => $bucket, 'count' => $rows]];
        });
    }


    /**
     * Get most active pages/routes
     */
    public function getMostActivePages($days = 7, $limit = 5)
    {
        $cacheKey = 'most_active_pages_' . $days . '_' . $limit;

        return Cache::remember($cacheKey, 60, function () use ($days, $limit) {
            return DB::table('sessions')
                ->select([
                    'payload',
                    DB::raw('COUNT(*) as visits')
                ])
                ->where('last_activity', '>=', Carbon::now()->subDays($days)->timestamp)
                ->groupBy('payload')
                ->orderByDesc('visits')
                ->limit($limit)
                ->get()
                ->map(function ($session) {
                    // Extract the last URL from session payload if available
                    $payload = @unserialize(base64_decode($session->payload));
                    $url = $payload['_previous']['url'] ?? 'N/A';
                    return [
                        'url' => $url,
                        'visits' => (int) $session->visits
                    ];
                })
                ->values()
                ->all();
        });
    }

    /**
     * Get visitor distribution by country
     */

     const BD_DIVISIONS = [
        'Dhaka' => ['192.168.0.0/24', '10.0.1.0/24'],
        'Chittagong' => ['192.168.1.0/24'],
        'Rajshahi' => ['192.168.2.0/24'],
        'Khulna' => ['192.168.3.0/24'],
        'Barishal' => ['192.168.4.0/24'],
        'Sylhet' => ['192.168.5.0/24'],
        'Rangpur' => ['192.168.6.0/24'],
        'Mymensingh' => ['192.168.7.0/24'],
    ];

    public static function getLocation($ip)
    {
        if (self::isLocalIp($ip)) {
            return [
                'division' => self::mapLocalIpToDivision($ip),
                'country' => 'BD'
            ];
        }

        return Cache::remember("ip_location_{$ip}", now()->addDays(30), function () use ($ip) {
            $response = Http::get("https://ipinfo.io/{$ip}/json?token=".config('services.ipinfo.token'));

            if ($response->successful()) {
                $data = $response->json();
                $country = $data['country'] ?? 'Unknown';

                return [
                    'country' => $country,
                    'division' => ($country === 'BD')
                        ? self::mapDivision($data['region'] ?? 'Unknown')
                        : 'International'
                ];
            }

            return ['division' => 'Unknown', 'country' => 'Unknown'];
        });
    }

    private static function mapLocalIpToDivision($ip)
    {
        foreach (self::BD_DIVISIONS as $division => $ranges) {
            foreach ($ranges as $range) {
                if (self::ipInRange($ip, $range)) {
                    return $division;
                }
            }
        }
        return 'Local Network';
    }

    private static function ipInRange($ip, $range)
    {
        list($subnet, $mask) = explode('/', $range);
        $ip_long = ip2long($ip);
        $subnet_long = ip2long($subnet);
        $mask_long = ~((1 << (32 - $mask)) - 1);
        return ($ip_long & $mask_long) === ($subnet_long & $mask_long);
    }

    private static function mapDivision($division)
    {
        foreach (array_keys(self::BD_DIVISIONS) as $validDivision) {
            if (stripos($division, $validDivision) !== false) {
                return $validDivision;
            }
        }
        return 'Other Division';
    }

    private static function isLocalIp($ip)
    {
        return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false;
    }
}

