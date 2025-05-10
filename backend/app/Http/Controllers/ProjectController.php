<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('manager:id,name')->get();
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'budget' => 'required|numeric|min:0',
            'status' => 'required|in:To Do,In Progress,Completed',
            'start_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:start_date',
            'completed_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project = Project::create($request->all());
        $project->load('manager:id,name');

        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        $project->load('manager:id,name');
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'sometimes|required|exists:users,id',
            'budget' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:To Do,In Progress,Completed',
            'start_date' => 'sometimes|required|date',
            'due_date' => 'sometimes|required|date|after_or_equal:start_date',
            'completed_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project->update($request->all());
        $project->load('manager:id,name');

        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(null, 204);
    }

    public function getProjectManagers()
    {
        $users = User::select('id', 'name')->get();
        return response()->json($users);
    }

    public function statistics(Project $project)
    {
        $totalTasks = $project->tasks()->count();
        $completedTasks = $project->tasks()->where('status', 'Completed')->count();
        $totalExpenditure = $project->total_expenditure;
        $budgetRemaining = $project->budget_remaining;
        
        return response()->json([
            'total_tasks' => $totalTasks,
            'completed_tasks' => $completedTasks,
            'completion_percentage' => $totalTasks > 0 ? ($completedTasks / $totalTasks * 100) : 0,
            'total_expenditure' => $totalExpenditure,
            'budget_remaining' => $budgetRemaining,
            'budget_utilization_percentage' => $project->budget > 0 ? ($totalExpenditure / $project->budget * 100) : 0,
        ]);
    }
   
}