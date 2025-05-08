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
            'month' => 'required|integer',
            'amount' => 'required|integer|min:0',
            'payment_date' => 'required|date'
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
            'resident_id' => 'sometimes|exists:residents,resident_id',
            'payment_type' => ['sometimes', Rule::in(array_column(PaymentType::cases(), 'value'))],
            'month' => 'sometimes|integer',
            'amount' => 'sometimes|integer|min:0',
            'payment_date' => 'sometimes|date',
            'month_period' => 'sometimes|integer',
            'year_period' => 'sometimes|integer'
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
