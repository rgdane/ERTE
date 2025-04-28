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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id('expense_id');
            $table->enum('expense_type', ['Kebersihan', 'Satpam', 'Lainnya']);
            $table->text('expense_description')->nullable();
            $table->integer('amount');
            $table->date('expense_date');
            $table->integer('month_period');
            $table->integer('year_period');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
