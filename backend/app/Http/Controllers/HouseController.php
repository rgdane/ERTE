<?php

namespace App\Http\Controllers;

use App\Models\House;
use Illuminate\Http\Request;

class HouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return House::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'house_address' => 'required|string|max:255',
            'is_occupied' => 'required',
        ]);

        $house = House::create($data);
        return response()->json($house, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return House::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $house = House::findOrFail($id);
        $data = $request->validate([
            'house_address' => 'sometimes|string|max:255',
            'is_occupied' => 'sometimes|in:0,1',
        ]);

        $house->update($data);
        return response()->json($house);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $house = House::findOrFail($id);

        $house->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
