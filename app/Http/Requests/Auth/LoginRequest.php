<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    // public function authenticate(): void
    // {
    //     $this->ensureIsNotRateLimited();

    //     if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
    //         RateLimiter::hit($this->throttleKey());

    //         throw ValidationException::withMessages([
    //             'email' => __('auth.failed'),
    //         ]);
    //     }
    //     $user = Auth::user();
    //     $allowedRoles = ['Admin', 'SuperAdmin'];
    //     if (!in_array(optional($user->role)->name, $allowedRoles)) {
    //         Auth::logout();
    //         throw ValidationException::withMessages([
    //             'email' => 'Anda tidak memiliki akses untuk login.',
    //         ]);
    //     }
    //     RateLimiter::clear($this->throttleKey());
    // }
    public function authenticate(): void
    {
        logger('⏳ Starting authentication process');
        $this->ensureIsNotRateLimited();

        logger('🔑 Attempting authentication for email: ' . $this->email);
        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            logger('❌ Authentication failed for email: ' . $this->email);
            RateLimiter::hit($this->throttleKey());
            logger('⚠️ Rate limited incremented for key: ' . $this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $user = Auth::user();
        logger('✅ User authenticated: ID ' . $user->id . ' - ' . $user->email);
        logger('🔍 User Object Dump:', [
            'ID' => $user->id,
            'Class' => get_class($user),
            'Attributes' => $user,
            'Raw Data' => $user
        ]);

        $allowedRoles = ['Admin', 'SuperAdmin'];
        $userRole = optional($user->role)->name;
        logger('🔍 Checking user role: ' . ($userRole ?? 'No role assigned'));

        if (!in_array($userRole, $allowedRoles)) {
            logger('🚫 Access denied for role: ' . ($userRole ?? 'null') .
                ' - Allowed roles: ' . implode(', ', $allowedRoles));
            Auth::logout();
            logger('👋 User logged out due to invalid role');

            throw ValidationException::withMessages([
                'email' => 'Anda tidak memiliki akses untuk login.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
        logger('♻️ Rate limiter cleared for key: ' . $this->throttleKey());
        logger('🎉 Authentication successful for user ID: ' . $user->id);
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }
}
