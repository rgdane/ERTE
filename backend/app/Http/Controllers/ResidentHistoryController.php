<?php

namespace App\Http\Controllers;

use App\Models\ResidentHistory;
use Illuminate\Http\Request;

class ResidentHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ResidentHistory::with(['resident', 'house'])->get();
    }

    public function indexByHouse($house_id)
    {
        $histories = ResidentHistory::with('resident')
                        ->where('house_id', $house_id)
                        ->orderByDesc('start_date')
                        ->get();

        return response()->json($histories);
    }

    public function indexByResident($resident_id)
    {
        $histories = ResidentHistory::with('house')
                        ->where('resident_id', $resident_id)
                        ->orderByDesc('start_date')
                        ->get();

        return response()->json($histories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'house_id' => 'required|exists:houses,house_id',
            'resident_id' => 'required|exists:residents,resident_id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
        ]);

        ResidentHistory::where('house_id', $data['house_id'])
            ->whereNull('end_date')
            ->update(['end_date' => now()]);
        
        $history = ResidentHistory::create([
            'house_id' => $data['house_id'],
            'resident_id' => $data['resident_id'],
            'start_date' => $data['start_date'],
            'end_date' => isset($data['end_date']) ? $data['end_date'] : null,
        ]);

        return response()->json([
            'message' => 'History created successfully.',
            'data' => $history
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'house_id' => 'sometimes|exists:houses,house_id',
            'resident_id' => 'sometimes|exists:residents,resident_id',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date',
        ]);

        $history = ResidentHistory::findOrFail($id);
        $history->update($data);

        return response()->json([
            'message' => 'History updated successfully.',
            'data' => $history
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $history = ResidentHistory::findOrFail($id);
        $history->delete();

        return response()->json([
            'message' => 'History deleted successfully.'
        ]);
    }
}
