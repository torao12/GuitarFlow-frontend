'use client';
import React from 'react';

interface FretboardProps {
  activeNotes: number[][]; // [cuerda, traste]
  barre?: {
    fret: number;
    from: number; // Ej: 6 (Mi grave)
    to: number;   // Ej: 1 (Mi agudo)
  };
}

const Fretboard: React.FC<FretboardProps> = ({ activeNotes, barre }) => {
  const strings = [1, 2, 3, 4, 5, 6]; // 1 es la más fina, 6 la más gruesa
  const frets = [1, 2, 3, 4, 5];

  // Calculamos los límites de la cejilla para que no se deforme
  const minString = barre ? Math.min(barre.from, barre.to) : 0;
  const maxString = barre ? Math.max(barre.from, barre.to) : 0;
  
  // Cada cuerda ocupa un 20% del espacio vertical (5 espacios entre 6 cuerdas)
  const stringGap = 20; 

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-[#f3d3a9] rounded-sm p-0 shadow-2xl border-l-[12px] border-[#2a1b10] h-56">
      {/* Trastes (Líneas divisorias verticales) */}
      <div className="absolute inset-0 flex justify-between">
        {frets.map((f) => (
          <div key={f} className="h-full w-[3px] bg-zinc-400/40 shadow-sm" />
        ))}
      </div>

      {/* Cuerdas (Líneas horizontales) */}
      <div className="relative flex flex-col justify-between h-full py-4 z-10">
        {strings.map((s) => (
          <div key={s} className="relative w-full h-[2px] bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 shadow-sm">
            {/* Notas individuales: Solo aparecen si el traste es mayor a 0 */}
            {activeNotes.map(([string, fret], i) => (
              string === s && fret > 0 && (
                <div 
                  key={i}
                  style={{ left: `${(fret * 20) - 10}%` }}
                  className="absolute top-1/2 -translate-y-1/2 w-9 h-9 bg-zinc-900 text-[#E5C07B] rounded-full flex items-center justify-center text-[10px] font-black shadow-xl z-30 border-2 border-zinc-800"
                >
                  {/* Espacio para número de dedo si se requiere */}
                </div>
              )
            ))}
          </div>
        ))}

        {/* LÓGICA DE LA CEJILLA (BARRE) - CORREGIDA */}
        {barre && (
          <div 
            style={{ 
              left: `${(barre.fret * 20) - 11}%`,
              // El top se basa en la cuerda menor (la de más arriba)
              top: `${(minString - 1) * stringGap}%`,
              // El alto es la diferencia entre cuerdas multiplicada por el gap
              height: `${(maxString - minString) * stringGap}%`
            }}
            className="absolute w-5 bg-zinc-900/95 rounded-full z-20 border-2 border-zinc-800 shadow-2xl flex items-center justify-center"
          >
             {/* Pequeño detalle de brillo para que parezca presión real */}
             <div className="w-1 h-[80%] bg-white/5 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Fretboard;