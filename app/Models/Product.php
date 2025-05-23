<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'm_products';
    protected $primaryKey = 'id';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'name',
        'price',
        'deleted_at',
        'restored_at',
        'image_url',
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
        return $this->belongsToMany(Tax::class, 'product_taxes', 'product_id', 'tax_id')
            ->withTimestamps();
    }
}
