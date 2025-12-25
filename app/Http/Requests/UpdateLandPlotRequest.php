<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLandPlotRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->id === $this->route('land_plot')->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'boundary_points' => ['sometimes', 'required', 'array', 'size:4'],
            'boundary_points.*.lat' => ['required_with:boundary_points', 'numeric', 'between:-90,90'],
            'boundary_points.*.lng' => ['required_with:boundary_points', 'numeric', 'between:-180,180'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'boundary_points.size' => 'A land plot must have exactly 4 boundary points.',
            'boundary_points.*.lat.between' => 'Latitude must be between -90 and 90 degrees.',
            'boundary_points.*.lng.between' => 'Longitude must be between -180 and 180 degrees.',
        ];
    }
}
