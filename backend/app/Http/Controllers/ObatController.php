<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use Illuminate\Http\Request;

class ObatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Obat::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_obat' => 'required|string|max:50',
            'kemasan' => 'required|string|max:35',
            'harga' => 'required|integer|min:0',
        ]);

        //simpan data poli
        $obat = Obat::create($validated);

        return response()->json(['message' => 'Obat created succesfully', 'data' => $obat], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $obat = Obat::find($id);
        
        if(!$obat){
            return response()->json(['message' => 'Obat not found'], 404);
        }

        return response()->json($obat);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'nama_obat' => 'required|string|max:50',
            'kemasan' => 'required|string|max:35',
            'harga' => 'required|integer|min:0',
        ]);

        $obat = Obat::find($id);

        if (!$obat){
            return response()->json(['message' => 'Obat not found'], 404);
        }

        $obat->update($validated);

        return response()->json(['message' => 'Obat updated succesfully', 'data' => $obat]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $obat = Obat::find($id);

        if (!$obat){
            return response()->json(['message' => 'Obat not found', 404]);
        }

        $obat->delete();
        
        return response()->json(['message' => 'Obat deleted succesfully']);
    }
}
