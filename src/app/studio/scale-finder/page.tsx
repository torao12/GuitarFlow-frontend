'use client';
import { useEffect, useState } from 'react';
import { guitarFlowApi } from '@/lib/api';
import { initAudio, playChord } from '@/lib/audio';

export default function ScaleFinder() {
  const [keys, setKeys] = useState([]);
  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);
  const [chords, setChords] = useState([]);

  useEffect(() => {
    // Cargar tonalidades al montar el componente
    guitarFlowApi.getKeys().then(setKeys);
  }, []);

  useEffect(() => {
    if (selectedKeyId) {
      // Cargar acordes diatónicos cuando se selecciona una tonalidad
      guitarFlowApi.getChordsByKey(selectedKeyId).then(setChords);
    }
  }, [selectedKeyId]);

  const handlePlayChord = async (chordName: string) => {
    await initAudio();
    // Aquí deberías mapear el nombre del acorde a notas reales. 
    // Ejemplo estático: C = C4, E4, G4
    const fakeNotes = [`${chordName}3`, `${chordName}4`]; // Simplificación
    playChord(fakeNotes);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 p-8 font-sans">
      <h1 className="text-3xl font-bold text-[#E5C07B] mb-6">Scale Finder</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Panel de Configuración */}
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333]">
          <h2 className="text-sm tracking-widest text-gray-400 mb-4 uppercase">Configuration</h2>
          
          <label className="block mb-2 text-sm">Tonalidad</label>
          <select 
            className="w-full bg-black border border-gray-700 rounded p-2 mb-4 text-white"
            onChange={(e) => setSelectedKeyId(Number(e.target.value))}
          >
            <option value="">Selecciona...</option>
            {keys.map((k: any) => (
              <option key={k.id} value={k.id}>{k.keyName} ({k.scaleType})</option>
            ))}
          </select>

          <button className="w-full bg-[#E5C07B] text-black font-semibold py-2 rounded mt-4">
            UPDATE LAYOUT
          </button>
        </div>

        {/* Visualización de Acordes */}
        <div className="md:col-span-3 bg-[#1E1E1E] p-6 rounded-lg border border-[#333]">
          <h2 className="text-xl mb-4">Acordes Diatónicos</h2>
          <div className="flex flex-wrap gap-4">
            {chords.map((chord: any) => (
              <div 
                key={chord.chordId} 
                onClick={() => handlePlayChord(chord.chordName.charAt(0))}
                className="cursor-pointer bg-black border border-[#E5C07B] rounded-lg p-4 w-32 flex flex-col items-center hover:bg-[#E5C07B] hover:text-black transition-colors"
              >
                <span className="text-xs mb-2">{chord.musicalDegree}</span>
                <span className="text-2xl font-bold">{chord.chordName}</span>
                <span className="text-xs mt-2 opacity-70">{chord.chordType}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}