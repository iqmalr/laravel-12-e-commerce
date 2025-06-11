<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Product;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalCustomers = Customer::count();
        $totalProducts = Product::count();
        $totalTransactions = Transaction::count();

        $today = now()->format('Y-m-d');
        $yesterday = now()->subDay()->format('Y-m-d');
        $thisMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();
        $lastMonthEnd = now()->subMonth()->endOfMonth();

        $todayTransactions = Transaction::whereDate('transaction_time', $today)->count();
        $yesterdayTransactions = Transaction::whereDate('transaction_time', $yesterday)->count();

        $monthTransactions = Transaction::whereDate('transaction_time', '>=', $thisMonth->format('Y-m-d'))->count();
        $lastMonthTransactions = Transaction::whereBetween('transaction_time', [$lastMonth, $lastMonthEnd])->count();

        $totalRevenue = TransactionItem::sum(DB::raw('subtotal + tax_amount'));
        $todayRevenue = TransactionItem::whereHas('transaction', function ($query) use ($today) {
            $query->whereDate('transaction_time', $today);
        })->sum(DB::raw('subtotal + tax_amount'));

        $monthRevenue = TransactionItem::whereHas('transaction', function ($query) use ($thisMonth) {
            $query->whereDate('transaction_time', '>=', $thisMonth);
        })->sum(DB::raw('subtotal + tax_amount'));

        $lastMonthRevenue = TransactionItem::whereHas('transaction', function ($query) use ($lastMonth, $lastMonthEnd) {
            $query->whereBetween('transaction_time', [$lastMonth, $lastMonthEnd]);
        })->sum(DB::raw('subtotal + tax_amount'));

        $todayGrowth = $yesterdayTransactions > 0 ? (($todayTransactions - $yesterdayTransactions) / $yesterdayTransactions) * 100 : 0;
        $monthGrowth = $lastMonthTransactions > 0 ? (($monthTransactions - $lastMonthTransactions) / $lastMonthTransactions) * 100 : 0;
        $revenueGrowth = $lastMonthRevenue > 0 ? (($monthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 : 0;

        $weeklyOrders = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayTransactions = Transaction::whereDate('transaction_time', $date->format('Y-m-d'))->count();
            $dayRevenue = TransactionItem::whereHas('transaction', function ($query) use ($date) {
                $query->whereDate('transaction_time', $date->format('Y-m-d'));
            })->sum(DB::raw('subtotal + tax_amount'));

            $weeklyOrders[] = [
                'date' => $date->format('M d'),
                'day' => $date->format('D'),
                'count' => $dayTransactions,
                'revenue' => $dayRevenue,
                'full_date' => $date->format('Y-m-d'),
            ];
        }

        $monthlyTransactions = collect(range(0, 11))->map(function ($i) {
            $date = now()->subMonths($i)->startOfMonth();
            $endDate = $date->copy()->endOfMonth();

            $transactions = Transaction::whereBetween('transaction_time', [$date, $endDate])->get();
            $count = $transactions->count();
            $revenue = $transactions->flatMap->items->sum(function ($item) {
                return $item->subtotal + $item->tax_amount;
            });


            return [
                'month' => $date->format('M Y'),
                'short_month' => $date->format('M'),
                'count' => $count,
                'revenue' => $revenue,
            ];
        })->reverse()->values();

        $recentTransactions = Transaction::with(['customer.user', 'transactionStatus', 'items'])
            ->orderBy('transaction_time', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($transaction) {
                $total = $transaction->items->sum(function ($item) {
                    return $item->subtotal + $item->tax_amount;
                });

                return [
                    'id' => $transaction->id,
                    'customer_name' => $transaction->customer->user->name ?? 'Guest',
                    'status' => $transaction->transactionStatus->name ?? 'N/A',
                    'total' => $total,
                    'items_count' => $transaction->items->count(),
                    'date' => $transaction->transaction_time->format('Y-m-d H:i:s'),
                    'time_ago' => $transaction->transaction_time->diffForHumans(),
                ];
            });

        $topProducts = TransactionItem::with('product')
            ->select(
                'product_id',
                DB::raw('SUM(quantity) as sold'),
                DB::raw('SUM(subtotal + tax_amount) as revenue'),
                DB::raw('COUNT(DISTINCT transaction_id) as orders')
            )
            ->groupBy('product_id')
            ->orderByDesc('sold')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->product->name ?? 'Unknown Product',
                    'sold' => $item->sold,
                    'revenue' => $item->revenue,
                    'orders' => $item->orders,
                    'avg_per_order' => $item->orders > 0 ? $item->sold / $item->orders : 0
                ];
            });

        $paymentMethods = Transaction::with('paymentMethod')
            ->select(
                'payment_method_id',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(
                        (SELECT SUM(subtotal + tax_amount)
                         FROM t_transaction_items
                         WHERE transaction_id = t_transactions.id)
                    ) as revenue')
            )
            ->groupBy('payment_method_id')
            ->orderByDesc('count')
            ->get()
            ->map(function ($transaction) use ($totalTransactions) {
                $percentage = $totalTransactions > 0 ? ($transaction->count / $totalTransactions) * 100 : 0;
                return [
                    'name' => $transaction->paymentMethod->name ?? 'Unknown',
                    'count' => $transaction->count,
                    'revenue' => $transaction->revenue ?? 0,
                    'percentage' => round($percentage, 1)
                ];
            });

        $lowStockProducts = Product::where('stock', '<=', 10)
            ->where('stock', '>', 0)
            ->orderBy('stock', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'name' => $product->name,
                    'stock' => $product->stock ?? 0,
                    'price' => $product->price ?? 0
                ];
            });

        $customerGrowth = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $newCustomers = Customer::whereDate('created_at', $date->format('Y-m-d'))->count();

            $customerGrowth[] = [
                'date' => $date->format('M d'),
                'count' => $newCustomers,
                'full_date' => $date->format('Y-m-d'),
            ];
        }

        $summary = [
            'stats' => [
                'total_users' => $totalUsers,
                'total_customers' => $totalCustomers,
                'total_products' => $totalProducts,
                'total_transactions' => $totalTransactions,
                'today_transactions' => $todayTransactions,
                'month_transactions' => $monthTransactions,
                'today_growth' => round($todayGrowth, 1),
                'month_growth' => round($monthGrowth, 1),
            ],
            'revenue' => [
                'total' => $totalRevenue,
                'today' => $todayRevenue,
                'month' => $monthRevenue,
                'growth' => round($revenueGrowth, 1),
            ],
            'charts' => [
                'weekly_orders' => $weeklyOrders,
                'monthly_transactions' => $monthlyTransactions,
                'customer_growth' => $customerGrowth,
            ],
            'recent_transactions' => $recentTransactions,
            'top_products' => $topProducts,
            'payment_methods' => $paymentMethods,
            'low_stock_products' => $lowStockProducts,
        ];

        return Inertia::render('dashboard', ['summary' => $summary]);
    }
}
