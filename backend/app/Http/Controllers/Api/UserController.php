<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function updatePassword(Request $request) {
        $user = auth()->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 401);
        }

        $validatedData = $request->validate([
            'password' => 'required',
            'new_password' => 'required|confirmed',
            "new_password_confirmation" => "required"
        ]);

        $user->password = bcrypt($validatedData['new_password']);

        if ($user->save()) {
            return response()->json(['message' => 'Password updated.'], 200);
        } else {
            return response()->json(['message' => 'Something went wrong.'], 500);
        }
    }

    public function updateProfile(Request $request) {
        $validatedData = $request->validate([
            'name' => 'required',
            'email' => 'required|unique:users,email,' . auth()->user()->id,
        ]);

        if (auth()->user()->update($validatedData)) {
            return ['message' => 'Profile updated.'];
        } else {
            return response()->json(['message' => 'Something went wrong.'], 500);
        }
    }
}
