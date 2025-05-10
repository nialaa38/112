<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('task_expenditures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->text('description');
            $table->decimal('amount', 15, 2);
            $table->date('date');
            $table->string('receipt_path')->nullable(); // For storing receipt files if needed
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('task_expenditures');
    }
}; 