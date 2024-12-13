<?php

namespace App\Http\Controllers;

use App\Models\Poli;
use Illuminate\Http\Request;

class PoliController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Poli::all());
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
            'nama_poli' => 'required|string|max:25',
            'keterangan' => 'required|string|max:255',
        ]);

        //simpan data poli
        $poli = Poli::create($validated);

        return response()->json(['message' => 'Poli created succesfully', 'data' => $poli], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $poli = Poli::find($id);
        
        if(!$poli){
            return response()->json(['message' => 'Poli not found'], 404);
        }

        return response()->json($poli);
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
            'nama_poli' => 'required|string|max:25',
            'keterangan' => 'required|string|max:255',
        ]);

        $poli = Poli::find($id);

        if (!$poli){
            return response()->json(['message' => 'Poli not found'], 404);
        }

        $poli->update($validated);

        return response()->json(['message' => 'Poli updated succesfully', 'data' => $poli]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $poli = Poli::find($id);

        if (!$poli){
            return response()->json(['message' => 'Poli not found', 404]);
        }

        $poli->delete();
        
        return response()->json(['message' => 'Poli deleted succesfully']);
    }
}
