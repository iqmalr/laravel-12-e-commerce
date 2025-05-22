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
        Schema::table('m_users', function (Blueprint $table) {
            $table->string('username')->unique()->after('name');
            $table->foreignId('role_id')->nullable()->constrained('m_roles')->after('password');
            $table->timestamp('deleted_at')->nullable()->after('updated_at');
            $table->timestamp('restored_at')->nullable()->after('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::table('m_users', function (Blueprint $table) {
        //     $table->dropColumn(['username', 'role_id', 'deleted_at', 'restored_at']);
        //     $table->dropForeign(['role_id']);
        // });
    }
};
