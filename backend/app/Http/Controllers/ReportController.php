<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getPaymentsByYear($year)
    {
        $payment = Payment::selectRaw('MONTH(payment_date) as month_date, SUM(amount) as total')
                    ->whereYear('payment_date', $year)
                    ->groupBy('month_date')
                    ->pluck('total', 'month_date');

        return $payment;
    }

    public function getPaymentsDetail($year, $month){
        $payment = Payment::whereYear('payment_date', $year)
                    ->whereMonth('payment_date', $month)
                    ->with('resident')
                    ->get();
        return $payment;
    }

    public function getExpensesByYear($year)
    {
        $expense = Expense::selectRaw('MONTH(expense_date) as month_date, SUM(amount) as total')
        ->whereYear('expense_date', $year)
        ->groupBy('month_date')
        ->get();

        return $expense;
    }

    public function getExpensesDetail($year, $month){
        $expense = Expense::whereYear('expense_date', $year)
                    ->whereMonth('expense_date', $month)
                    ->get();
        return $expense;
    }

    public function getYear(){
        $years = DB::table('payments')
            ->selectRaw('YEAR(payment_date) as year')
            ->whereNull('deleted_at')
            ->union(
                DB::table('expenses')
                    ->selectRaw('YEAR(expense_date) as year')
                    ->whereNull('deleted_at')
            )
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year');
        return $years;
    }
}
