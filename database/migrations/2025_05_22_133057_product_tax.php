<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('t_product_taxes', function (Blueprint $table) {
            $table->uuid('id');
            $table->uuid('product_id');
            $table->foreign('product_id')->references('id')->on('products');
            $table->string('tax_id');
            $table->foreign('tax_id')->references('id')->on('taxes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
