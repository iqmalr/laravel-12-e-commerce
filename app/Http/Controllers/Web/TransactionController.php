<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Customer;
use App\Models\PaymentMethod;
use App\Models\TransactionStatus;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with([
            'customer.user',
            'staff',
            'paymentMethod',
            'transactionStatus',
            'items.product'
        ]);

        if ($request->has('status_id')) {
            $query->where('transaction_status_id', $request->status_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('transaction_time', [
                $request->start_date,
                $request->end_date
            ]);
        }

        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        $perPage = $request->get('per_page', 15);
        $transactions = $query->orderBy('transaction_time', 'desc')->paginate($perPage);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:m_customers,id',
            'payment_method_id' => 'required|exists:m_payment_methods,id',
            'transaction_status_id' => 'required|exists:m_transaction_statuses,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.applied_tax_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        DB::beginTransaction();

        try {
            $transaction = Transaction::create([
                'customer_id' => $request->customer_id,
                'staff_id' => auth()->id(),
                'transaction_time' => $request->transaction_time ?? Carbon::now(),
                'payment_method_id' => $request->payment_method_id,
                'transaction_status_id' => $request->transaction_status_id,
            ]);

            $totalAmount = 0;
            foreach ($request->items as $item) {
                $taxPercentage = $item['applied_tax_percentage'] ?? 0;
                $subtotal = $item['quantity'] * $item['unit_price'];
                $taxAmount = ($subtotal * $taxPercentage) / 100;

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $subtotal,
                    'applied_tax_percentage' => $taxPercentage,
                    'tax_amount' => $taxAmount,
                ]);

                $totalAmount += $subtotal + $taxAmount;
            }

            DB::commit();

            return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil dibuat. Total: Rp' . number_format($totalAmount, 0, ',', '.'));
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal membuat transaksi: ' . $e->getMessage());
        }
    }

    public function show(string $id)
    {
        try {
            $transaction = Transaction::with([
                'customer.user',
                'staff',
                'paymentMethod',
                'transactionStatus',
                'items.product'
            ])->findOrFail($id);

            $totalAmount = $transaction->items->sum(function ($item) {
                return $item->subtotal + $item->tax_amount;
            });

            return Inertia::render('Transactions/Show', [
                'transaction' => $transaction,
                'totalAmount' => $totalAmount,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('transactions.index')->with('error', 'Transaksi tidak ditemukan: ' . $e->getMessage());
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'sometimes|exists:m_customers,id',
            'payment_method_id' => 'sometimes|exists:m_payment_methods,id',
            'transaction_status_id' => 'sometimes|exists:m_transaction_statuses,id',
            'items' => 'sometimes|array|min:1',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.unit_price' => 'required_with:items|numeric|min:0',
            'items.*.applied_tax_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        DB::beginTransaction();

        try {
            $transaction = Transaction::findOrFail($id);

            $transaction->update($request->only([
                'customer_id',
                'payment_method_id',
                'transaction_status_id'
            ]));

            if ($request->has('items')) {
                $transaction->items()->delete();

                foreach ($request->items as $item) {
                    $taxPercentage = $item['applied_tax_percentage'] ?? 0;
                    $subtotal = $item['quantity'] * $item['unit_price'];
                    $taxAmount = ($subtotal * $taxPercentage) / 100;

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
            }

            DB::commit();

            return redirect()->route('transactions.show', $transaction->id)->with('success', 'Transaksi berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal memperbarui transaksi: ' . $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        DB::beginTransaction();

        try {
            $transaction = Transaction::findOrFail($id);
            $transaction->items()->delete();
            $transaction->delete();

            DB::commit();

            return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('transactions.index')->with('error', 'Gagal menghapus transaksi: ' . $e->getMessage());
        }
    }

    public function summary(Request $request)
    {
        try {
            $query = Transaction::with('items');

            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('transaction_time', [
                    $request->start_date,
                    $request->end_date
                ]);
            }

            $transactions = $query->get();

            $summary = [
                'total_transactions' => $transactions->count(),
                'total_amount' => $transactions->sum(function ($transaction) {
                    return $transaction->items->sum(function ($item) {
                        return $item->subtotal + $item->tax_amount;
                    });
                }),
                'average_transaction_value' => 0,
                'total_items_sold' => $transactions->sum(function ($transaction) {
                    return $transaction->items->sum('quantity');
                }),
                'transactions_by_status' => []
            ];

            if ($summary['total_transactions'] > 0) {
                $summary['average_transaction_value'] = $summary['total_amount'] / $summary['total_transactions'];
            }

            $statusGroups = $transactions->groupBy('transaction_status_id');
            foreach ($statusGroups as $statusId => $statusTransactions) {
                $status = TransactionStatus::find($statusId);
                $summary['transactions_by_status'][] = [
                    'status_name' => $status->name ?? 'Unknown',
                    'count' => $statusTransactions->count(),
                    'total_amount' => $statusTransactions->sum(function ($transaction) {
                        return $transaction->items->sum(function ($item) {
                            return $item->subtotal + $item->tax_amount;
                        });
                    })
                ];
            }

            return Inertia::render('Transactions/Summary', [
                'summary' => $summary,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('transactions.index')->with('error', 'Gagal mengambil ringkasan transaksi: ' . $e->getMessage());
        }
    }
}
