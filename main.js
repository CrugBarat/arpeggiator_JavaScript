let started = false;

document.documentElement.addEventListener('mousedown', () => {
  if (started) return;
  started = true;

  const synth = new Tone.Synth();
  synth.oscillator.type = 'triangle';
  synth.toMaster();

  const chords = [
                    'D0 F0 A0', 'E0 G0 B0', 'F0 A0 C0', 'G0 B0 D0', 'A0 C0 E0',
                    'D1 F0 A1', 'E1 G0 B1', 'F1 A0 C1', 'G1 B0 D1', 'A1 C0 E1',
                    'D0 F1 A0', 'E0 G1 B0', 'F0 A1 C0', 'G0 B1 D3', 'A0 C1 E0'
                  ].map(formatChords);

  function formatChords(chords) {
    let chord = chords.split(' ');
    let newChordArr = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < chord.length; j++) {
        let noteValue = chord[j].split('');
        let note = noteValue[0];
        let octave = (noteValue[1] === '0') ? i + 3 : i + 2;
        note += octave;
        newChordArr.push(note);
      }
    }
    return newChordArr;
  }

  const inputs = document.querySelectorAll('input');

  Array.from(inputs).forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) handleChord(input.value);
    })
  });


  let chordIndex = 0;

  function handleChord(value) {
    chordIndex = parseInt(value) - 1;
  }

  Tone.Transport.scheduleRepeat(onRepeat, '16n');
  Tone.Transport.start();
  Tone.Transport.bpm.value = 130;

  let step = 0;

  function onRepeat(time) {
    let chord = chords[chordIndex],
        note = chord[step % chord.length];
    synth.triggerAttackRelease(note, '16n', time);
    step++;
  }

});
