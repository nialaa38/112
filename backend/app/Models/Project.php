<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'budget',
        'status',
        'start_date',
        'due_date',
        'completed_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'completed_date' => 'date',
        'budget' => 'decimal:2',
    ];

    public function manager()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function expenditures()
    {
        return $this->hasMany(Expenditure::class);
    }

    public function getTotalExpenditureAttribute()
    {
        return $this->expenditures->sum('amount');
    }

    public function getBudgetRemainingAttribute()
    {
        return $this->budget - $this->total_expenditure;
    }
}
