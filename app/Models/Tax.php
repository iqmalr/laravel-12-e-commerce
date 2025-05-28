<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class Tax extends Model
{
    use HasFactory, HasUuids, SoftDeletes, Notifiable;

    protected $table = 'm_taxes';
    protected $primaryKey = 'id';
    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'name',
        'percentage'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 't_product_taxes', 'tax_id', 'product_id')
            ->withTimestamps();
    }
}
