<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use App\Models\Notification;
use Illuminate\Http\Request;

class TaskCommentController extends Controller
{
    public function store(Request $request, $taskId)
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:255',
        ]);

        $comment = TaskComment::create([
            'task_id' => $taskId,
            'user_id' => auth()->id(),
            'comment' => $validated['comment'],
        ]);

        // Return the newly created comment
        return response()->json($comment, 201);
    }

    public function getCommentsByTask(Task $task)
    {
        return response()->json($task->comments()->with('user')->get());
    }
}
