<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $primaryKey = 'id';
    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'name',
        'percentage',
        'valid_from',
        'valid_to'
    ];

    protected $casts = [
        'percentage' => 'integer',
        'valid_from' => 'datetime',
        'valid_to' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->where(function ($query) {
            $query->whereNull('valid_to')
                ->orWhere('valid_to', '>=', now());
        });
    }

    public function scopeDeleted($query)
    {
        return $query->whereNotNull('valid_to')
            ->where('valid_to', '<=', now());
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_taxes', 'tax_id', 'product_id')
            ->withTimestamps();
    }
}
