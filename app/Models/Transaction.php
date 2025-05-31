<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, HasUuids;
    protected $table = 't_transactions';
    protected $fillable = [
        'customer_id',
        'staff_id',
        'transaction_time',
        'payment_method_id',
        'transaction_status_id',
    ];
    protected $keyType = 'string';
    protected $casts = [
        'transaction_time' => 'datetime',
    ];
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function items()
    {
        return $this->hasMany(TransactionItem::class, 'transaction_id');
    }
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function transactionStatus()
    {
        return $this->belongsTo(TransactionStatus::class);
    }
}
