/* =========================================================
   JAGDBLÄSERCORPS RADEVORMWALD
   APP.JS
   ========================================================= */


/* =========================================================
   AUDIOPLAYER
   Nur eine Aufnahme gleichzeitig.
   ========================================================= */

const players =
  document.querySelectorAll("audio");


players.forEach((player) => {

  player.addEventListener("play", () => {

    players.forEach((otherPlayer) => {

      if (otherPlayer !== player) {
        otherPlayer.pause();
      }

    });

  });

});


/* =========================================================
   STIMMEN-ÜBUNGSBEREICHE
   ========================================================= */

const practiceAreas =
  document.querySelectorAll(".practice-area");


practiceAreas.forEach((area) => {

  area.addEventListener("toggle", () => {

    if (!area.open) {

      const voicePlayers =
        area.querySelectorAll("audio");


      voicePlayers.forEach((player) => {
        player.pause();
      });

    }

  });

});


/* =========================================================
   METRONOM
   ========================================================= */

const bpmDisplay =
  document.getElementById("bpmDisplay");

const bpmSlider =
  document.getElementById("bpmSlider");

const bpmMinus =
  document.getElementById("bpmMinus");

const bpmPlus =
  document.getElementById("bpmPlus");

const metronomeStart =
  document.getElementById("metronomeStart");

const metronomeText =
  document.getElementById("metronomeText");

const metronomeSymbol =
  document.getElementById("metronomeSymbol");

const beatIndicator =
  document.getElementById("beatIndicator");

const timeButtons =
  document.querySelectorAll(".time-button");


/* Grundeinstellungen */

let bpm = 100;

let beatsPerMeasure = 4;

let currentBeat = 0;

let metronomeRunning = false;

let timerID = null;

let audioContext = null;


/* =========================================================
   TAKTPUNKTE ERZEUGEN
   ========================================================= */

function createBeatDots() {

  beatIndicator.innerHTML = "";


  for (
    let i = 0;
    i < beatsPerMeasure;
    i++
  ) {

    const dot =
      document.createElement("span");

    dot.classList.add("beat-dot");

    beatIndicator.appendChild(dot);

  }

}


createBeatDots();


/* =========================================================
   BPM ÄNDERN
   ========================================================= */

function setBpm(value) {

  bpm = Math.max(
    40,
    Math.min(200, value)
  );


  bpmDisplay.textContent = bpm;

  bpmSlider.value = bpm;


  /*
    Wenn das Metronom läuft,
    wird das neue Tempo direkt übernommen.
  */

  if (metronomeRunning) {
    restartTimer();
  }

}


/* Minus */

bpmMinus.addEventListener(
  "click",
  () => {

    setBpm(bpm - 1);

  }
);


/* Plus */

bpmPlus.addEventListener(
  "click",
  () => {

    setBpm(bpm + 1);

  }
);


/* Slider */

bpmSlider.addEventListener(
  "input",
  () => {

    setBpm(
      Number(bpmSlider.value)
    );

  }
);


/* =========================================================
   TAKTART
   ========================================================= */

timeButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      beatsPerMeasure =
        Number(
          button.dataset.beats
        );


      timeButtons.forEach((other) => {
        other.classList.remove("active");
      });


      button.classList.add("active");


      currentBeat = 0;

      createBeatDots();

    }
  );

});


/* =========================================================
   AUDIO CONTEXT
   ========================================================= */

function getAudioContext() {

  if (!audioContext) {

    audioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  }


  if (
    audioContext.state === "suspended"
  ) {

    audioContext.resume();

  }


  return audioContext;

}


/* =========================================================
   KLICKTON ERZEUGEN
   ========================================================= */

function playClick(isAccent) {

  const context =
    getAudioContext();


  const oscillator =
    context.createOscillator();

  const gain =
    context.createGain();


  oscillator.connect(gain);

  gain.connect(
    context.destination
  );


  /*
    Erster Taktschlag:
    höher und etwas kräftiger.
  */

  oscillator.frequency.value =
    isAccent ? 1200 : 800;


  oscillator.type = "sine";


  const now =
    context.currentTime;


  gain.gain.setValueAtTime(
    0.0001,
    now
  );


  gain.gain.exponentialRampToValueAtTime(
    isAccent ? 0.35 : 0.22,
    now + 0.002
  );


  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + 0.055
  );


  oscillator.start(now);

  oscillator.stop(
    now + 0.06
  );

}


/* =========================================================
   EINEN TAKTSCHLAG ABSPIELEN
   ========================================================= */

function tick() {

  const dots =
    beatIndicator.querySelectorAll(
      ".beat-dot"
    );


  dots.forEach((dot) => {
    dot.classList.remove("current");
  });


  if (dots[currentBeat]) {

    dots[currentBeat]
      .classList
      .add("current");

  }


  const firstBeat =
    currentBeat === 0;


  playClick(firstBeat);


  currentBeat++;


  if (
    currentBeat >= beatsPerMeasure
  ) {

    currentBeat = 0;

  }

}


/* =========================================================
   TIMER STARTEN
   ========================================================= */

function startTimer() {

  /*
    Erster Schlag sofort.
  */

  tick();


  const interval =
    60000 / bpm;


  timerID =
    setInterval(
      tick,
      interval
    );

}


/* =========================================================
   TIMER BEI BPM ÄNDERUNG NEU STARTEN
   ========================================================= */

function restartTimer() {

  clearInterval(timerID);

  timerID = null;


  const interval =
    60000 / bpm;


  timerID =
    setInterval(
      tick,
      interval
    );

}


/* =========================================================
   METRONOM STARTEN
   ========================================================= */

function startMetronome() {

  if (metronomeRunning) {
    return;
  }


  /*
    AudioContext muss durch eine
    Benutzeraktion gestartet werden.
  */

  getAudioContext();


  metronomeRunning = true;

  currentBeat = 0;


  startTimer();


  metronomeStart
    .classList
    .add("running");


  metronomeSymbol.textContent =
    "■";


  metronomeText.textContent =
    "Metronom stoppen";

}


/* =========================================================
   METRONOM STOPPEN
   ========================================================= */

function stopMetronome() {

  clearInterval(timerID);

  timerID = null;

  metronomeRunning = false;

  currentBeat = 0;


  const dots =
    beatIndicator.querySelectorAll(
      ".beat-dot"
    );


  dots.forEach((dot) => {
    dot.classList.remove("current");
  });


  metronomeStart
    .classList
    .remove("running");


  metronomeSymbol.textContent =
    "▶";


  metronomeText.textContent =
    "Metronom starten";

}


/* =========================================================
   START / STOP BUTTON
   ========================================================= */

metronomeStart.addEventListener(
  "click",
  () => {

    if (metronomeRunning) {

      stopMetronome();

    }

    else {

      startMetronome();

    }

  }
);


/* =========================================================
   METRONOM STOPPEN,
   WENN DER BEREICH GESCHLOSSEN WIRD
   ========================================================= */

const metronomeArea =
  document.getElementById("metronome");


metronomeArea.addEventListener(
  "toggle",
  () => {

    if (
      !metronomeArea.open &&
      metronomeRunning
    ) {

      stopMetronome();

    }

  }
);

/* =========================================================
   STIMMGERÄT FÜR JAGDHORN IN B
   ========================================================= */


/*
   Das Mikrofon misst die tatsächlich klingende Frequenz.

   Für die Anzeige wird anschließend für ein Instrument
   in B transponiert.

   Dadurch sieht der Bläser die notierte Tonhöhe,
   wie sie auch in den Jagdhornnoten steht.
*/


const tunerArea =
  document.getElementById("tuner");

const tunerStart =
  document.getElementById("tunerStart");

const tunerStartText =
  document.getElementById("tunerStartText");

const tunerStartSymbol =
  document.getElementById("tunerStartSymbol");

const tunerNote =
  document.getElementById("tunerNote");

const tunerCents =
  document.getElementById("tunerCents");

const tunerFrequency =
  document.getElementById("tunerFrequency");

const tunerNeedle =
  document.getElementById("tunerNeedle");

const tunerStatus =
  document.getElementById("tunerStatus");


let tunerRunning = false;

let tunerAudioContext = null;

let tunerAnalyser = null;

let tunerSource = null;

let tunerStream = null;

let tunerAnimationFrame = null;


/*
   Chromatische Notennamen.

   Intern arbeiten wir mit MIDI-Notennummern.
*/

const noteNames = [
  "C",
  "C♯",
  "D",
  "E♭",
  "E",
  "F",
  "F♯",
  "G",
  "A♭",
  "A",
  "B♭",
  "B"
];


/* =========================================================
   AUTOKORRELATION

   Ermittelt die Grundfrequenz aus dem Mikrofonsignal.

   Für unser erstes Stimmgerät ist diese Methode deutlich
   sinnvoller als einfach nur den lautesten FFT-Peak
   auszuwerten, weil ein Jagdhorn starke Obertöne besitzt.
   ========================================================= */

function autoCorrelate(buffer, sampleRate) {

  const size =
    buffer.length;


  /*
     Lautstärke des Eingangssignals bestimmen.
  */

  let rms = 0;


  for (
    let i = 0;
    i < size;
    i++
  ) {

    const value =
      buffer[i];

    rms +=
      value * value;

  }


  rms =
    Math.sqrt(
      rms / size
    );


  /*
     Bei zu wenig Signal keine
     Tonhöhe anzeigen.
  */

  if (rms < 0.01) {
    return -1;
  }


  /*
     Leise Bereiche am Anfang und Ende
     des Puffers entfernen.
  */

  let start = 0;

  let end =
    size - 1;


  const threshold =
    0.2;


  for (
    let i = 0;
    i < size / 2;
    i++
  ) {

    if (
      Math.abs(buffer[i]) <
      threshold
    ) {

      start = i;
    }

    else {
      break;
    }

  }


  for (
    let i = 1;
    i < size / 2;
    i++
  ) {

    if (
      Math.abs(
        buffer[size - i]
      ) < threshold
    ) {

      end =
        size - i;
    }

    else {
      break;
    }

  }


  const trimmed =
    buffer.slice(
      start,
      end
    );


  const trimmedSize =
    trimmed.length;


  const correlations =
    new Array(
      trimmedSize
    ).fill(0);


  /*
     Autokorrelation berechnen.
  */

  for (
    let lag = 0;
    lag < trimmedSize;
    lag++
  ) {

    for (
      let i = 0;
      i < trimmedSize - lag;
      i++
    ) {

      correlations[lag] +=

        trimmed[i] *
        trimmed[i + lag];

    }

  }


  /*
     Ersten fallenden Bereich überspringen.
  */

  let d = 0;


  while (
    correlations[d] >
    correlations[d + 1]
  ) {

    d++;

  }


  /*
     Höchste Korrelation suchen.
  */

  let maxValue = -1;

  let maxPosition = -1;


  for (
    let i = d;
    i < trimmedSize;
    i++
  ) {

    if (
      correlations[i] >
      maxValue
    ) {

      maxValue =
        correlations[i];

      maxPosition =
        i;

    }

  }


  if (
    maxPosition <= 0
  ) {

    return -1;

  }


  /*
     Kleine Interpolation für eine
     genauere Frequenzbestimmung.
  */

  let period =
    maxPosition;


  if (
    maxPosition > 0 &&
    maxPosition <
      correlations.length - 1
  ) {

    const x1 =
      correlations[
        maxPosition - 1
      ];

    const x2 =
      correlations[
        maxPosition
      ];

    const x3 =
      correlations[
        maxPosition + 1
      ];


    const denominator =
      x1 -
      2 * x2 +
      x3;


    if (
      denominator !== 0
    ) {

      period +=

        0.5 *
        (x1 - x3) /
        denominator;

    }

  }


  return (
    sampleRate /
    period
  );

}


/* =========================================================
   FREQUENZ -> MIDI NOTE
   ========================================================= */

function frequencyToMidi(
  frequency
) {

  return (

    69 +

    12 *

    Math.log2(
      frequency / 440
    )

  );

}


/* =========================================================
   NOTIERTE TONHÖHE FÜR B-INSTRUMENT

   Ein B-Instrument klingt einen Ganzton tiefer
   als notiert.

   Deshalb addieren wir für die Anzeige
   zwei Halbtöne.
   ========================================================= */

function getWrittenNote(
  soundingMidi
) {

  const writtenMidi =
    Math.round(
      soundingMidi
    ) + 2;


  const noteIndex =
    (
      writtenMidi % 12 + 12
    ) % 12;


  return {
    midi: writtenMidi,
    name: noteNames[noteIndex]
  };

}


/* =========================================================
   CENT-ABWEICHUNG

   Wichtig:
   Die Transposition verändert die Cent-Abweichung nicht.

   Deshalb vergleichen wir die gemessene klingende
   Tonhöhe mit der nächstgelegenen klingenden MIDI-Note.
   ========================================================= */

function getCents(
  midiValue
) {

  const nearestMidi =
    Math.round(
      midiValue
    );


  return (
    100 *
    (
      midiValue -
      nearestMidi
    )
  );

}


/* =========================================================
   ANZEIGE AKTUALISIEREN
   ========================================================= */

function updateTunerDisplay(
  frequency
) {

  const soundingMidi =
    frequencyToMidi(
      frequency
    );


  const writtenNote =
    getWrittenNote(
      soundingMidi
    );


  const cents =
    getCents(
      soundingMidi
    );


  /* Ton */

  tunerNote.textContent =
    writtenNote.name;


  /* Frequenz */

  tunerFrequency.textContent =
    frequency.toFixed(1) +
    " Hz";


  /* Cent */

  const roundedCents =
    Math.round(cents);


  if (roundedCents > 0) {

    tunerCents.textContent =
      "+" +
      roundedCents +
      " Cent";

  }

  else if (
    roundedCents < 0
  ) {

    tunerCents.textContent =
      roundedCents +
      " Cent";

  }

  else {

    tunerCents.textContent =
      "0 Cent";

  }


  /* =====================================================
     NADEL

     -50 Cent = ganz links
      0 Cent = Mitte
     +50 Cent = ganz rechts
     ===================================================== */

  const limitedCents =
    Math.max(
      -50,
      Math.min(
        50,
        cents
      )
    );


  const needlePosition =
    50 +
    limitedCents;


  tunerNeedle.style.left =
    needlePosition + "%";


  /* =====================================================
     STATUS

     ±5 Cent gelten zunächst als sauber gestimmt.
     ===================================================== */

  tunerStatus.classList.remove(
    "in-tune"
  );


  if (
    Math.abs(cents) <= 5
  ) {

    tunerStatus.textContent =
      "✓ Ton passt";

    tunerStatus.classList.add(
      "in-tune"
    );

  }

  else if (
    cents < -5
  ) {

    tunerStatus.textContent =
      "Ton ist zu tief";

  }

  else {

    tunerStatus.textContent =
      "Ton ist zu hoch";

  }

}


/* =========================================================
   MIKROFONSIGNAL ANALYSIEREN
   ========================================================= */

function analyseTuner() {

  if (
    !tunerRunning
  ) {

    return;

  }


  const buffer =
    new Float32Array(
      tunerAnalyser.fftSize
    );


  tunerAnalyser
    .getFloatTimeDomainData(
      buffer
    );


  const frequency =
    autoCorrelate(
      buffer,
      tunerAudioContext.sampleRate
    );


  /*
     Nur plausible Frequenzen verwenden.

     Der Bereich ist bewusst großzügig,
     damit wir beim Testen sehen können,
     was das Mikrofon erkennt.
  */

  if (
    frequency > 50 &&
    frequency < 1500
  ) {

    updateTunerDisplay(
      frequency
    );

  }

  else {

    tunerNote.textContent =
      "–";

    tunerCents.textContent =
      "Kein stabiler Ton";

    tunerFrequency.textContent =
      "– Hz";

    tunerNeedle.style.left =
      "50%";

    tunerStatus.textContent =
      "Spiele einen gleichmäßigen Ton.";

    tunerStatus.classList.remove(
      "in-tune"
    );

  }


  tunerAnimationFrame =
    requestAnimationFrame(
      analyseTuner
    );

}


/* =========================================================
   STIMMGERÄT STARTEN
   ========================================================= */

async function startTuner() {

  try {

    /*
       Mikrofon anfordern.
    */

    tunerStream =
      await navigator.mediaDevices
        .getUserMedia({

          audio: {

            echoCancellation: false,

            noiseSuppression: false,

            autoGainControl: false

          }

        });


    tunerAudioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();


    tunerAnalyser =
      tunerAudioContext
        .createAnalyser();


    /*
       Größerer Puffer hilft insbesondere
       bei tieferen Tönen.
    */

    tunerAnalyser.fftSize =
      4096;


    tunerSource =
      tunerAudioContext
        .createMediaStreamSource(
          tunerStream
        );


    tunerSource.connect(
      tunerAnalyser
    );


    tunerRunning = true;


    tunerStart
      .classList
      .add("running");


    tunerStartSymbol.textContent =
      "■";


    tunerStartText.textContent =
      "Mikrofon stoppen";


    tunerStatus.textContent =
      "Spiele einen gleichmäßigen Ton.";


    analyseTuner();

  }

  catch (error) {

    console.error(
      "Mikrofon konnte nicht gestartet werden:",
      error
    );


    tunerStatus.textContent =
      "Mikrofonzugriff nicht möglich.";


    tunerCents.textContent =
      "Bitte Mikrofonfreigabe prüfen.";

  }

}


/* =========================================================
   STIMMGERÄT STOPPEN
   ========================================================= */

function stopTuner() {

  tunerRunning = false;


  if (
    tunerAnimationFrame
  ) {

    cancelAnimationFrame(
      tunerAnimationFrame
    );

    tunerAnimationFrame =
      null;

  }


  if (
    tunerStream
  ) {

    tunerStream
      .getTracks()
      .forEach(
        (track) =>
          track.stop()
      );


    tunerStream = null;

  }


  if (
    tunerAudioContext
  ) {

    tunerAudioContext.close();

    tunerAudioContext =
      null;

  }


  tunerAnalyser = null;

  tunerSource = null;


  /* Anzeige zurücksetzen */

  tunerNote.textContent =
    "–";


  tunerCents.textContent =
    "Mikrofon nicht aktiv";


  tunerFrequency.textContent =
    "– Hz";


  tunerNeedle.style.left =
    "50%";


  tunerStatus.textContent =
    "Spiele einen gleichmäßigen Ton.";


  tunerStatus.classList.remove(
    "in-tune"
  );


  tunerStart
    .classList
    .remove("running");


  tunerStartSymbol.textContent =
    "●";


  tunerStartText.textContent =
    "Mikrofon starten";

}


/* =========================================================
   START / STOP
   ========================================================= */

tunerStart.addEventListener(
  "click",
  () => {

    if (
      tunerRunning
    ) {

      stopTuner();

    }

    else {

      startTuner();

    }

  }
);


/* =========================================================
   BEIM SCHLIESSEN STOPPEN
   ========================================================= */

tunerArea.addEventListener(
  "toggle",
  () => {

    if (
      !tunerArea.open &&
      tunerRunning
    ) {

      stopTuner();

    }

  }
);
