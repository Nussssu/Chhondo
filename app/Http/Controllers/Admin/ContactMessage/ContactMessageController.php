<?php

namespace App\Http\Controllers\Admin\ContactMessage;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of contact messages
     */
    public function index()
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/ContactMessages/Index', ['messages' => $messages]);
    }

    /**
     * Display the specified contact message
     */
    /**
     * Mark a message read. The message body already ships with the index
     * payload and is shown in a modal, so this no longer renders a page.
     */
    public function show($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['is_read' => true]);

        return response()->json(['id' => $message->id, 'is_read' => true]);
    }

    /**
     * Remove the specified contact message
     */
    public function destroy($id)
    {
        try {
            $message = ContactMessage::findOrFail($id);
            $message->delete();
            return ApiResponse::success(null, 'Message deleted successfully');
        } catch (\Exception $e) {
            Log::error('ContactMessageController@destroy', ['message' => $e->getMessage()]);
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    /**
     * Get unread message count (for AJAX)
     */
    public function unreadCount()
    {
        $count = ContactMessage::where('is_read', false)->count();
        return response()->json(['count' => $count]);
    }
}
