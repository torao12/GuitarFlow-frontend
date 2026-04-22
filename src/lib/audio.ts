import * as Tone from 'tone';

export const CHORD_LIBRARY: Record<string, { notes: string[], barre?: { fret: number, from: number, to: number }, fretNotes: number[][] }> = {
  'C':    { notes: ['C3', 'E3', 'G3', 'C4', 'E4'], fretNotes: [[5, 3], [4, 2], [2, 1]] },
  'Cm':   { notes: ['C3', 'Eb3', 'G3', 'C4', 'Eb4'], barre: { fret: 3, from: 5, to: 1 }, fretNotes: [[5, 3], [4, 5], [3, 5], [2, 4]] },
  'D':    { notes: ['D3', 'A3', 'D4', 'F#4'], fretNotes: [[4, 0], [3, 2], [2, 3], [1, 2]] },
  'Dm':   { notes: ['D3', 'A3', 'D4', 'F4'], fretNotes: [[4, 0], [3, 2], [2, 3], [1, 1]] },
  'E':    { notes: ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'], fretNotes: [[5, 2], [4, 2], [3, 1]] },
  'Em':   { notes: ['E2', 'B2', 'E3', 'G3', 'B3', 'E4'], fretNotes: [[5, 2], [4, 2]] },
  'F':    { notes: ['F2', 'C3', 'F3', 'A3', 'C4', 'F4'], barre: { fret: 1, from: 6, to: 1 }, fretNotes: [[5, 3], [4, 3], [3, 2]] },
  'F#m':  { notes: ['F#2', 'C#3', 'F#3', 'A3', 'C#4', 'F#4'], barre: { fret: 2, from: 6, to: 1 }, fretNotes: [[5, 4], [4, 4]] },
  'G':    { notes: ['G2', 'B2', 'D3', 'G3', 'B3', 'G4'], fretNotes: [[6, 3], [5, 2], [1, 3]] },
  'G#m':  { notes: ['G#2', 'D#3', 'G#3', 'B3', 'D#4', 'G#4'], barre: { fret: 4, from: 6, to: 1 }, fretNotes: [[5, 6], [4, 6]] },
  'A':    { notes: ['A2', 'E3', 'A3', 'C#4', 'E4'], fretNotes: [[4, 2], [3, 2], [2, 2]] },
  'Am':   { notes: ['A2', 'E3', 'A3', 'C4', 'E4'], fretNotes: [[4, 2], [3, 2], [2, 1]] },
  'B':    { notes: ['B2', 'F#3', 'B3', 'D#4', 'F#4'], barre: { fret: 2, from: 5, to: 1 }, fretNotes: [[4, 4], [3, 4], [2, 4]] },
  'Bm':   { notes: ['B2', 'F#3', 'B3', 'D4', 'F#4'], barre: { fret: 2, from: 5, to: 1 }, fretNotes: [[4, 4], [3, 4], [2, 3]] },
  'C#m':  { notes: ['C#3', 'G#3', 'C#4', 'E4', 'G#4'], barre: { fret: 4, from: 5, to: 1 }, fretNotes: [[4, 6], [3, 6], [2, 5]] },
};

export const createGuitarSynth = () => {
  if (typeof window === 'undefined') return null;
  const reverb = new Tone.Reverb({ decay: 3, wet: 0.3 }).toDestination();
  return new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 4,
    modulationIndex: 20,
    envelope: { attack: 0.01, decay: 2, sustain: 0, release: 2 },
  }).connect(reverb);
};

export const strumChord = (chordName: string, synth: any) => {
  const data = CHORD_LIBRARY[chordName];
  if (!data || !synth) return;
  const now = Tone.now();
  data.notes.forEach((note, i) => {
    synth.triggerAttackRelease(note, "1n", now + (i * 0.05)); // Rasgueo armónico
  });
};