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
        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke tabel users (bisa kosong jika diakses tamu/guest sebelum login)
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            
            // Parameter Sensor Input
            $table->float('temperature');
            $table->float('ph');
            $table->float('dissolved_oxygen');
            $table->float('fish_weight');
            
            // Kolom Opsional Kelompok (Dibuat nullable agar tidak memicu error SQL)
            $table->integer('fish_age')->nullable();
            $table->float('feed_amount')->nullable();
            
            // Output Keputusan dari AI Python Vendra
            $table->string('prediction_result');
            $table->string('multiplier_rate');
            $table->string('decision_method');
            $table->text('analyst_notes')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('predictions');
    }
};
