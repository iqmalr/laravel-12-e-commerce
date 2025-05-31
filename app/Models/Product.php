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
        'description',
        'price',
        'deleted_at',
        'restored_at',
        'image_url',
        'image_public_id'
    ];

    public function taxes()
    {
        return $this->belongsToMany(Tax::class, 't_product_taxes', 'product_id', 'tax_id')
            ->withTimestamps();
    }
}
