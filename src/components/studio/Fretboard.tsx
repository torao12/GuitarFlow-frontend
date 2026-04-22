'use client';
interface FretboardProps { activeNotes?: number[][]; }

export default function Fretboard({ activeNotes = [] }: FretboardProps) {
  const strings = [1, 2, 3, 4, 5, 6];
  const frets = Array.from({ length: 13 }, (_, i) => i);
  return (
    <div className="w-full overflow-x-auto py-6 scrollbar-hide">
      <div className="relative min-w-[800px] h-48 bg-[#1a1a1a] rounded-xl border border-border-subtle">
        <div className="flex h-full">
          {frets.map((f) => (
            <div key={f} className="flex-1 border-r border-zinc-800/50 relative">
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 font-bold">{f}</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
          {strings.map((s) => <div key={s} className="w-full h-[1px] bg-zinc-700/50" />)}
        </div>
        {activeNotes.map(([s, f], i) => (
          <div key={i} className="absolute w-6 h-6 rounded-full bg-gold-accent border-2 border-black z-10"
            style={{ left: `calc(${(f / 12) * 100}% - 12px)`, top: `calc(${((s - 1) / 5) * 100}% - 12px)` }} />
        ))}
      </div>
    </div>
  );
}