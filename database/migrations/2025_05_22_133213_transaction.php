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
        Schema::create('t_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('customer_id');
            $table->uuid('staff_id');
            $table->timestamp('transaction_time');
            $table->integer('payment_method_id');
            $table->integer('transaction_status_id');
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('staff_id')->references('id')->on('users');
            $table->foreign('payment_method_id')->references('id')->on('payment_methods');
            $table->foreign('transaction_status_id')->references('id')->on('transaction_statuses');
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
