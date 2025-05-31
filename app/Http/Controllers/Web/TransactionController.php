<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Customer;
use App\Models\Product;
use App\Models\PaymentMethod;
use App\Models\TransactionStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions
     */
    public function index(): Response
    {
        $transactions = Transaction::with([
            'customer.user:id,name',
            'staff:id,name',
            'paymentMethod:id,name',
            'transactionStatus:id,name',
            'items.product:id,name'
        ])
            ->orderBy('transaction_time', 'desc')
            ->paginate(15);

        return Inertia::render('Transaction/Index', [
            'transactions' => $transactions
        ]);
    }

    /**
     * Show the form for creating a new transaction
     */
    public function create(): Response
    {
        $customers = Customer::with('user:id,name')
            ->whereHas('user')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->user->name ?? 'Unknown',
                ];
            });

        $products = Product::select('id', 'name', 'price')
            ->orderBy('name')
            ->get();

        $paymentMethods = PaymentMethod::select('id', 'name')
            ->orderBy('name')
            ->get();

        $transactionStatuses = TransactionStatus::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Transaction/Create', [
            'customers' => $customers,
            'products' => $products,
            'paymentMethods' => $paymentMethods,
            'transactionStatuses' => $transactionStatuses,
        ]);
    }

    /**
     * Store a newly created transaction
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:m_customers,id',
            'payment_method_id' => 'required|exists:m_payment_methods,id',
            'transaction_status_id' => 'required|exists:m_transaction_statuses,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:m_products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.applied_tax_percentage' => 'nullable|numeric|min:0|max:100',
        ]);
        DB::beginTransaction();

        try {
            $transaction = Transaction::create([
                'customer_id' => $validated['customer_id'],
                'staff_id' => Auth::id(),
                'transaction_time' => now(),
                'payment_method_id' => $validated['payment_method_id'],
                'transaction_status_id' => $validated['transaction_status_id'],
            ]);
            foreach ($validated['items'] as $index => $item) {
                $taxPercentage = $item['applied_tax_percentage'] ?? 0;
                $subtotal = $item['quantity'] * $item['unit_price'];
                $taxAmount = $subtotal * ($taxPercentage / 100);

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $subtotal,
                    'applied_tax_percentage' => $taxPercentage,
                    'tax_amount' => $taxAmount,
                ]);
            }

            DB::commit();
            return redirect()
                ->route('transaction.index')
                ->with('success', 'Transaksi berhasil dibuat!');
        } catch (\Exception $e) {
            DB::rollback();
            return back()
                ->withInput()
                ->withErrors(['error' => 'Gagal membuat transaksi: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified transaction
     */
    public function show(Transaction $transaction): Response
    {
        $transaction->load([
            'customer.user:id,name,email,phone',
            'staff:id,name',
            'paymentMethod:id,name,description',
            'transactionStatus:id,name,description',
            'items.product:id,name,description'
        ]);

        $subtotal = $transaction->items->sum('subtotal');
        $totalTax = $transaction->items->sum('tax_amount');
        $grandTotal = $subtotal + $totalTax;

        return Inertia::render('Transaction/Show', [
            'transaction' => $transaction,
            'totals' => [
                'subtotal' => $subtotal,
                'total_tax' => $totalTax,
                'grand_total' => $grandTotal,
            ]
        ]);
    }

    /**
     * Get transaction summary/statistics
     */
    public function summary()
    {
        $today = now()->startOfDay();
        $thisMonth = now()->startOfMonth();

        $summary = [
            'today' => [
                'count' => Transaction::whereDate('transaction_time', $today)->count(),
                'total' => $this->calculateDayTotal($today),
            ],
            'this_month' => [
                'count' => Transaction::whereDate('transaction_time', '>=', $thisMonth)->count(),
                'total' => $this->calculateMonthTotal($thisMonth),
            ],
            'recent_transactions' => Transaction::with([
                'customer.user:id,name',
                'transactionStatus:id,name'
            ])
                ->orderBy('transaction_time', 'desc')
                ->limit(5)
                ->get()
        ];

        return response()->json($summary);
    }

    /**
     * Search transactions
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        $status = $request->get('status');
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        $transactions = Transaction::with([
            'customer.user:id,name',
            'staff:id,name',
            'transactionStatus:id,name'
        ])
            ->when($query, function ($q) use ($query) {
                $q->whereHas('customer.user', function ($subQ) use ($query) {
                    $subQ->where('name', 'like', "%{$query}%");
                });
            })
            ->when($status, function ($q) use ($status) {
                $q->where('transaction_status_id', $status);
            })
            ->when($dateFrom, function ($q) use ($dateFrom) {
                $q->whereDate('transaction_time', '>=', $dateFrom);
            })
            ->when($dateTo, function ($q) use ($dateTo) {
                $q->whereDate('transaction_time', '<=', $dateTo);
            })
            ->orderBy('transaction_time', 'desc')
            ->paginate(15);

        return Inertia::render('Transaction/Index', [
            'transactions' => $transactions,
            'filters' => [
                'q' => $query,
                'status' => $status,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ]
        ]);
    }

    /**
     * Export transactions to PDF
     */
    public function exportPdf(Request $request)
    {

        $transactions = Transaction::with([
            'customer.user',
            'staff',
            'paymentMethod',
            'transactionStatus',
            'items.product'
        ])
            ->when($request->date_from, function ($q) use ($request) {
                $q->whereDate('transaction_time', '>=', $request->date_from);
            })
            ->when($request->date_to, function ($q) use ($request) {
                $q->whereDate('transaction_time', '<=', $request->date_to);
            })
            ->orderBy('transaction_time', 'desc')
            ->get();

        return response()->json([
            'message' => 'Export PDF functionality needs to be implemented with your preferred PDF library'
        ]);
    }

    /**
     * Calculate total for a specific day
     */
    private function calculateDayTotal($date)
    {
        return Transaction::whereDate('transaction_time', $date)
            ->with('items')
            ->get()
            ->sum(function ($transaction) {
                return $transaction->items->sum(function ($item) {
                    return $item->subtotal + $item->tax_amount;
                });
            });
    }

    /**
     * Calculate total for current month
     */
    private function calculateMonthTotal($date)
    {
        return Transaction::whereDate('transaction_time', '>=', $date)
            ->with('items')
            ->get()
            ->sum(function ($transaction) {
                return $transaction->items->sum(function ($item) {
                    return $item->subtotal + $item->tax_amount;
                });
            });
    }

    /**
     * Print transaction receipt
     */
    public function printReceipt(Transaction $transaction)
    {
        $transaction->load([
            'customer.user',
            'staff',
            'paymentMethod',
            'transactionStatus',
            'items.product'
        ]);

        return Inertia::render('Transaction/Receipt', [
            'transaction' => $transaction
        ]);
    }
}
