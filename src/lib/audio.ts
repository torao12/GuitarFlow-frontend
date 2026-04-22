import * as Tone from 'tone';

let synth: Tone.PolySynth | null = null;

export const initAudio = async () => {
  await Tone.start();
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 1.5 }
    }).toDestination();
  }
};

export const playChord = (notes: string[], duration: string = '4n') => {
  if (synth) {
    synth.triggerAttackRelease(notes, duration);
  }
};