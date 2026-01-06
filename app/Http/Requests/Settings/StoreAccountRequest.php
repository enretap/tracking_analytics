<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class StoreAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'domain' => ['nullable', 'string', 'max:255'],
            'reference_ctrack' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'settings' => ['nullable', 'json'],
            'platform_ids' => ['nullable', 'array'],
            'platform_ids.*' => ['integer', 'exists:platforms,id'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
