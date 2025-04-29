<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Resident::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'resident_fullname' => 'required|string|max:255',
            'resident_phone' => 'required|string|max:20',
            'is_permanent' => 'required',
            'is_married' => 'required',
            'is_active' => 'required',
            'resident_id_card' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('resident_id_card')) {
            $data['resident_id_card'] = $request->file('resident_id_card')->store('ktp','public');
        }

        $resident = Resident::create($data);
        return response()->json($resident, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($is_active)
    {
        return Resident::where('is_active', $is_active)->get();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $resident = Resident::findOrFail($id);
        $data = $request->validate([
            'resident_fullname' => 'sometimes|string|max:255',
            'resident_phone' => 'sometimes|string|max:20',
            'is_permanent' => 'sometimes|in:0,1',
            'is_married' => 'sometimes|in:0,1',
            'is_active' => 'sometimes|in:0,1',
            'resident_id_card' => 'nullable|image|max:2048',
        ]);
        
        if ($request->hasFile('resident_id_card')) {
            if ($resident->resident_id_card) {
                Storage::disk('public')->delete($resident->resident_id_card);
            }
            $data['resident_id_card'] = $request->file('resident_id_card')->store('ktp', 'public');
        }

        $resident->update($data);
        return response()->json($resident);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $resident = Resident::findOrFail($id);
        if ($resident->resident_id_card) {
            Storage::disk('public')->delete($resident->resident_id_card);
        }
        $resident->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
