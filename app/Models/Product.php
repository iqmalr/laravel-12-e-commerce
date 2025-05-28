<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $table = 'm_products';
    protected $primaryKey = 'id';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'name',
        'price',
        'deleted_at',
        'restored_at',
    ];

    protected $casts = [
        'price' => 'integer',
        'deleted_at' => 'datetime',
        'restored_at' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at');
    }

    public function scopeDeleted($query)
    {
        return $query->whereNotNull('deleted_at');
    }

    public function taxes()
    {
        return $this->belongsToMany(Tax::class, 't_product_taxes', 'product_id', 'tax_id')
            ->withTimestamps();
    }
}
