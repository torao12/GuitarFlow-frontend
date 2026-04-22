'use client';
import React from 'react';

interface FretboardProps {
  activeNotes: number[][];
  barre?: { fret: number, from: number, to: number };
}

const Fretboard: React.FC<FretboardProps> = ({ activeNotes, barre }) => {
  const strings = [1, 2, 3, 4, 5, 6];
  const frets = [1, 2, 3, 4, 5];
  const stringGap = 20;

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-[#f3d3a9] h-56 rounded-sm border-l-[12px] border-[#2a1b10] shadow-2xl overflow-hidden">
      <div className="absolute inset-0 flex justify-between">
        {frets.map(f => <div key={f} className="h-full w-[2px] bg-zinc-400/30" />)}
      </div>

      <div className="relative h-full flex flex-col justify-between py-4 z-10">
        {strings.map(s => (
          <div key={s} className="relative w-full h-[2px] bg-zinc-400 shadow-sm">
            {activeNotes.map(([str, fr], i) => (
              str === s && fr > 0 && (
                <div key={i} style={{ left: `${(fr * 20) - 10}%` }} className="absolute top-1/2 -translate-y-1/2 w-9 h-9 bg-zinc-900 rounded-full border-2 border-zinc-700 shadow-xl z-30" />
              )
            ))}
          </div>
        ))}

        {barre && (
          <div 
            style={{ 
              left: `${(barre.fret * 20) - 11}%`,
              top: `${(Math.min(barre.from, barre.to) - 1) * stringGap}%`,
              height: `${Math.abs(barre.from - barre.to) * stringGap}%`
            }} 
            className="absolute w-5 bg-zinc-900/95 rounded-full z-20 border-2 border-zinc-800 shadow-2xl" 
          />
        )}
      </div>
    </div>
  );
};

export default Fretboard;