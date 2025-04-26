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
        Schema::create('payments', function (Blueprint $table) {
            $table->id('payment_id');        
            $table->unsignedBigInteger('resident_id');            
            $table->enum('payment_type', ['kebersihan', 'satpam']);
            $table->integer('amount');
            $table->date('payment_date');
            $table->string('month');
            $table->integer('year');
            $table->boolean('is_paid')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('resident_id')->references('resident_id')->on('residents')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
