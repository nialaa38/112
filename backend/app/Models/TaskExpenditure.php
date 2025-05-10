<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskExpenditure extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'description',
        'amount',
        'date',
        'receipt_path',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
} 