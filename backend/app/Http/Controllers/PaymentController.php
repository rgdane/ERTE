<?php

namespace App\Http\Controllers;

use App\Enums\PaymentType;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::with('resident')->latest()->get();
        return response()->json($payments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'resident_id' => 'required|exists:residents,resident_id',
            'payment_type' => ['required', Rule::in(array_column(PaymentType::cases(), 'value'))],
            'amount' => 'required|integer|min:0',
            'payment_date' => 'required|date',
            'month' => 'required|string',
            'year' => 'required|integer',
            'is_paid' => 'boolean',
        ]);

        $payment = Payment::create($data);

        return response()->json([
            'message' => 'Payment recorded successfully.',
            'data' => $payment,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $payment = Payment::with('resident')->findOrFail($id);
        return response()->json($payment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $data = $request->validate([
            'payment_type' => ['sometimes', Rule::in(array_column(PaymentType::cases(), 'value'))],
            'amount' => 'sometimes|integer|min:0',
            'payment_date' => 'sometimes|date',
            'month' => 'sometimes|string',
            'year' => 'sometimes|integer',
            'is_paid' => 'boolean',
        ]);

        $payment->update($data);

        return response()->json([
            'message' => 'Payment updated successfully.',
            'data' => $payment,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete(); // soft delete
        return response()->json(['message' => 'Payment Deleted successfully.']);
    }
}
