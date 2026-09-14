<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'sku' => ['sometimes', 'string', 'max:255', Rule::unique('products', 'sku')->ignore($this->route('product'))],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'type' => ['sometimes', 'string', 'in:product,service'],
            'stock' => ['required_if:type,product', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
