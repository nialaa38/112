<?php

namespace App\Http\Controllers;

use App\Models\TimeEntry;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TimeEntryController extends Controller
{
    public function index(Request $request)
    {
        $query = TimeEntry::with(['user:id,name', 'task:id,title']);
        
        if ($request->has('task_id')) {
            $query->where('task_id', $request->task_id);
        }
        
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        $timeEntries = $query->get();
        
        return response()->json($timeEntries);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'task_id' => 'required|exists:tasks,id',
            'user_id' => 'required|exists:users,id',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after:start_time',
            'hours' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $timeEntry = TimeEntry::create($request->all());
        $timeEntry->load(['user:id,name', 'task:id,title']);

        return response()->json($timeEntry, 201);
    }

    public function show(TimeEntry $timeEntry)
    {
        $timeEntry->load(['user:id,name', 'task:id,title']);
        return response()->json($timeEntry);
    }

    public function update(Request $request, TimeEntry $timeEntry)
    {
        $validator = Validator::make($request->all(), [
            'task_id' => 'sometimes|required|exists:tasks,id',
            'user_id' => 'sometimes|required|exists:users,id',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'nullable|date|after:start_time',
            'hours' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $timeEntry->update($request->all());
        $timeEntry->load(['user:id,name', 'task:id,title']);

        return response()->json($timeEntry);
    }

    public function destroy(TimeEntry $timeEntry)
    {
        $timeEntry->delete();
        return response()->json(null, 204);
    }

    public function getTimeEntriesByTask(Task $task)
    {
        $timeEntries = $task->timeEntries()->with('user:id,name')->get();
        return response()->json($timeEntries);
    }
}