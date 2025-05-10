<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('user_id')->comment('Project Manager')->constrained()->onDelete('cascade');
            $table->decimal('budget', 15, 2)->default(0);
            $table->enum('status', ['To Do', 'In Progress', 'Completed'])->default('To Do');
            $table->date('completed_date')->nullable();
            $table->date('start_date');
            $table->date('due_date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('projects');
    }
};
