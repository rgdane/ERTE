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
        Schema::create('resident_histories', function (Blueprint $table) {
            $table->id('resident_history_id');
            $table->unsignedBigInteger('resident_id');
            $table->unsignedBigInteger('house_id');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('resident_id')->references('resident_id')->on('residents')->onDelete('cascade');
            $table->foreign('house_id')->references('house_id')->on('houses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resident_histories');
    }
};
