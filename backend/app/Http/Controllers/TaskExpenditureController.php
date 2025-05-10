<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskExpenditure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TaskExpenditureController extends Controller
{
    /**
     * Get all expenditures for a specific task.
     */
    public function getExpendituresByTask(Task $task)
    {
        return response()->json($task->expenditures()->orderBy('date', 'desc')->get());
    }

    /**
     * Store a new task expenditure.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'task_id' => 'required|exists:tasks,id',
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'receipt' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        
        // Handle file upload if receipt is provided
        if ($request->hasFile('receipt')) {
            $path = $request->file('receipt')->store('receipts', 'public');
            $data['receipt_path'] = $path;
        }

        $expenditure = TaskExpenditure::create($data);
        
        return response()->json($expenditure, 201);
    }

    /**
     * Get a specific task expenditure.
     */
    public function show(TaskExpenditure $taskExpenditure)
    {
        return response()->json($taskExpenditure);
    }

    /**
     * Update a task expenditure.
     */
    public function update(Request $request, TaskExpenditure $taskExpenditure)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'sometimes|required|string',
            'amount' => 'sometimes|required|numeric|min:0',
            'date' => 'sometimes|required|date',
            'receipt' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        
        // Handle file upload if receipt is provided
        if ($request->hasFile('receipt')) {
            // Remove old receipt if exists
            if ($taskExpenditure->receipt_path) {
                Storage::disk('public')->delete($taskExpenditure->receipt_path);
            }
            
            $path = $request->file('receipt')->store('receipts', 'public');
            $data['receipt_path'] = $path;
        }

        $taskExpenditure->update($data);
        
        return response()->json($taskExpenditure);
    }

    /**
     * Delete a task expenditure.
     */
    public function destroy(TaskExpenditure $taskExpenditure)
    {
        // Remove receipt file if exists
        if ($taskExpenditure->receipt_path) {
            Storage::disk('public')->delete($taskExpenditure->receipt_path);
        }
        
        $taskExpenditure->delete();
        
        return response()->json(null, 204);
    }
} 