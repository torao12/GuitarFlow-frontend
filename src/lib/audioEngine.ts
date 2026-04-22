import * as Tone from 'tone';

// Catálogo de estructuras (Voicings)
const CHORD_STRUCTURES: Record<string, string[]> = {
  'maj': ['C3', 'E3', 'G3', 'C4', 'E4'], // Voicings más abiertos como en guitarra
  'min': ['C3', 'Eb3', 'G3', 'C4', 'Eb4'],
  'dim': ['C4', 'Eb4', 'Gb4'],
  '7': ['C3', 'E3', 'G3', 'Bb3', 'C4'],
  'maj7': ['C3', 'E3', 'G3', 'B3', 'E4'],
  'm7': ['C3', 'Eb3', 'G3', 'Bb3', 'Eb4'],
  'm7b5': ['C3', 'Eb3', 'Gb3', 'Bb3'],
};

const NOTE_INDEX: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
  'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

const INDEX_TO_NOTE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const getNotesFromChord = (chordName: string): string[] => {
  const match = chordName.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return ['C3', 'E3', 'G3'];

  const root = match[1];
  const type = match[2] || 'maj';
  const rootIndex = NOTE_INDEX[root];
  const structure = CHORD_STRUCTURES[type] || CHORD_STRUCTURES['maj'];

  return structure.map(noteStr => {
    const noteMatch = noteStr.match(/^([A-G][#b]?)(\d)$/);
    if (!noteMatch) return noteStr;
    const baseNote = noteMatch[1];
    const octave = parseInt(noteMatch[2]);
    const interval = NOTE_INDEX[baseNote];
    const newIndex = (rootIndex + interval) % 12;
    const octaveShift = Math.floor((rootIndex + interval) / 12);
    return `${INDEX_TO_NOTE[newIndex]}${octave + octaveShift}`;
  });
};

export const createSynth = () => {
  if (typeof window === 'undefined') return null;

  // Reverb para emular el cuerpo de la guitarra
  const reverb = new Tone.Reverb({
    decay: 2.5,
    wet: 0.3
  }).toDestination();

  // FMSynth configurado para sonar metálico y con ataque de púa
  return new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3,
    modulationIndex: 10,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.01, // Ataque rápido de púa
      decay: 1.2,
      sustain: 0.1,
      release: 1.2
    },
    modulation: { type: "square" },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.5,
      sustain: 0,
      release: 0.5
    }
  }).connect(reverb);
};

/**
 * Simula el rasgueo de una guitarra (Strumming)
 * En lugar de tocar todas las notas a la vez, las dispara con milisegundos de diferencia.
 */
export const playChord = (chordName: string, synth: any, timeOffset: number = 0) => {
  try {
    const notes = getNotesFromChord(chordName);
    const strumDelay = 0.035; // 35ms entre cuerdas (simula la mano bajando)

    notes.forEach((note, index) => {
      synth.triggerAttackRelease(
        note, 
        "1n", 
        Tone.now() + timeOffset + (index * strumDelay)
      );
    });
  } catch (e) {
    console.error("Audio error:", e);
  }
};