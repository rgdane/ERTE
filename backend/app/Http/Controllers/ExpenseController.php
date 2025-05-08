<?php

namespace App\Http\Controllers;

use App\Enums\ExpenseType;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Expense::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'expense_type' => ['required', Rule::in(array_column(ExpenseType::cases(), 'value'))],
            'expense_description' => 'nullable|string',
            'amount' => 'required|integer|min:0',
            'expense_date' => 'required|date'
        ]);

        $expense = Expense::create($data);
        return response()->json($expense, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Expense::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);
        $data = $request->validate([
            'expense_type' => ['sometimes', Rule::in(array_column(ExpenseType::cases(), 'value'))],
            'expense_description' => 'nullable|string',
            'amount' => 'sometimes|integer|min:0',
            'expense_date' => 'sometimes|date'
        ]);

        $expense->update($data);
        return response()->json($expense);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);

        $expense->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
