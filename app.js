/* =========================================================
   JAGDBLÄSERCORPS HEGERING RADEVORMWALD
   APP.JS
   ========================================================= */


/* =========================================================
   AUDIOPLAYER
   Immer nur eine Aufnahme gleichzeitig abspielen
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
   STÜCKE
   Beim Einklappen alle Aufnahmen des Stücks stoppen
   ========================================================= */

const pieceCards =
  document.querySelectorAll(".piece-card");


pieceCards.forEach((pieceCard) => {

  pieceCard.addEventListener("toggle", () => {

    if (!pieceCard.open) {

      const piecePlayers =
        pieceCard.querySelectorAll("audio");


      piecePlayers.forEach((player) => {
        player.pause();
      });


      /*
         Falls der Bereich "Stimmen einzeln üben"
         geöffnet ist, schließen wir ihn ebenfalls.
      */

      const practiceAreas =
        pieceCard.querySelectorAll(".practice-area");


      practiceAreas.forEach((area) => {
        area.open = false;
      });

    }

  });

});



/* =========================================================
   STIMMEN-ÜBUNGSBEREICHE
   Beim Einklappen die Einzelstimmen stoppen
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
   WIEDERGABEGESCHWINDIGKEIT

   Geschwindigkeit gilt für alle Aufnahmen
   innerhalb des jeweiligen Stücks.
   ========================================================= */

pieceCards.forEach((pieceCard) => {

  const speedButtons =
    pieceCard.querySelectorAll(
      ".speed-button"
    );


  const piecePlayers =
    pieceCard.querySelectorAll(
      "audio"
    );


  speedButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const speed =
          Number(
            button.dataset.speed
          );


        /* Geschwindigkeit setzen */

        piecePlayers.forEach((player) => {

          player.playbackRate =
            speed;


          if (
            "preservesPitch"
            in player
          ) {

            player.preservesPitch =
              true;

          }


          if (
            "webkitPreservesPitch"
            in player
          ) {

            player.webkitPreservesPitch =
              true;

          }

        });


        /* Alte Auswahl entfernen */

        speedButtons.forEach(
          (otherButton) => {

            otherButton
              .classList
              .remove("active");

          }
        );


        /* Neue Auswahl markieren */

        button
          .classList
          .add("active");

      }
    );

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

const metronomeArea =
  document.getElementById("metronome");


let bpm = 100;

let beatsPerMeasure = 4;

let currentBeat = 0;

let metronomeRunning = false;

let timerID = null;

let metronomeAudioContext = null;



/* =========================================================
   TAKTPUNKTE ERSTELLEN
   ========================================================= */

function createBeatDots() {

  if (!beatIndicator) {
    return;
  }


  beatIndicator.innerHTML = "";


  for (
    let i = 0;
    i < beatsPerMeasure;
    i++
  ) {

    const dot =
      document.createElement("span");


    dot.classList.add(
      "beat-dot"
    );


    beatIndicator.appendChild(
      dot
    );

  }

}


createBeatDots();



/* =========================================================
   BPM EINSTELLEN
   ========================================================= */

function setBpm(value) {

  bpm =
    Math.max(
      40,
      Math.min(
        200,
        value
      )
    );


  if (bpmDisplay) {
    bpmDisplay.textContent =
      bpm;
  }


  if (bpmSlider) {
    bpmSlider.value =
      bpm;
  }


  if (metronomeRunning) {
    restartTimer();
  }

}



if (bpmMinus) {

  bpmMinus.addEventListener(
    "click",
    () => {

      setBpm(
        bpm - 1
      );

    }
  );

}



if (bpmPlus) {

  bpmPlus.addEventListener(
    "click",
    () => {

      setBpm(
        bpm + 1
      );

    }
  );

}



if (bpmSlider) {

  bpmSlider.addEventListener(
    "input",
    () => {

      setBpm(
        Number(
          bpmSlider.value
        )
      );

    }
  );

}



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


      timeButtons.forEach(
        (otherButton) => {

          otherButton
            .classList
            .remove("active");

        }
      );


      button
        .classList
        .add("active");


      currentBeat = 0;


      createBeatDots();

    }
  );

});



/* =========================================================
   AUDIOCONTEXT DES METRONOMS
   ========================================================= */

function getMetronomeAudioContext() {

  if (!metronomeAudioContext) {

    metronomeAudioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  }


  if (
    metronomeAudioContext.state ===
    "suspended"
  ) {

    metronomeAudioContext.resume();

  }


  return metronomeAudioContext;

}



/* =========================================================
   METRONOM-KLICK
   ========================================================= */

function playClick(isAccent) {

  const context =
    getMetronomeAudioContext();


  const oscillator =
    context.createOscillator();


  const gain =
    context.createGain();


  oscillator.connect(gain);

  gain.connect(
    context.destination
  );


  oscillator.frequency.value =
    isAccent
      ? 1200
      : 800;


  oscillator.type =
    "sine";


  const now =
    context.currentTime;


  gain.gain.setValueAtTime(
    0.0001,
    now
  );


  gain.gain.exponentialRampToValueAtTime(
    isAccent
      ? 0.35
      : 0.22,
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
   TAKTSCHLAG
   ========================================================= */

function tick() {

  if (!beatIndicator) {
    return;
  }


  const dots =
    beatIndicator.querySelectorAll(
      ".beat-dot"
    );


  dots.forEach((dot) => {

    dot.classList.remove(
      "current"
    );

  });


  if (dots[currentBeat]) {

    dots[currentBeat]
      .classList
      .add("current");

  }


  const firstBeat =
    currentBeat === 0;


  playClick(
    firstBeat
  );


  currentBeat++;


  if (
    currentBeat >=
    beatsPerMeasure
  ) {

    currentBeat = 0;

  }

}



/* =========================================================
   METRONOM TIMER
   ========================================================= */

function startTimer() {

  tick();


  const interval =
    60000 / bpm;


  timerID =
    setInterval(
      tick,
      interval
    );

}



function restartTimer() {

  clearInterval(
    timerID
  );


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
   METRONOM START
   ========================================================= */

function startMetronome() {

  if (metronomeRunning) {
    return;
  }


  /*
     Falls das Stimmgerät läuft,
     stoppen wir es.

     Sonst würde das Mikrofon die
     Metronom-Klicks aufnehmen.
  */

  if (
    typeof tunerRunning !==
      "undefined" &&
    tunerRunning
  ) {

    stopTuner();

  }


  /*
     Laufende Musik stoppen.
  */

  players.forEach((player) => {
    player.pause();
  });


  getMetronomeAudioContext();


  metronomeRunning = true;

  currentBeat = 0;


  startTimer();


  if (metronomeStart) {

    metronomeStart
      .classList
      .add("running");

  }


  if (metronomeSymbol) {

    metronomeSymbol.textContent =
      "■";

  }


  if (metronomeText) {

    metronomeText.textContent =
      "Metronom stoppen";

  }

}



/* =========================================================
   METRONOM STOP
   ========================================================= */

function stopMetronome() {

  clearInterval(
    timerID
  );


  timerID = null;

  metronomeRunning = false;

  currentBeat = 0;


  if (beatIndicator) {

    const dots =
      beatIndicator.querySelectorAll(
        ".beat-dot"
      );


    dots.forEach((dot) => {

      dot.classList.remove(
        "current"
      );

    });

  }


  if (metronomeStart) {

    metronomeStart
      .classList
      .remove("running");

  }


  if (metronomeSymbol) {

    metronomeSymbol.textContent =
      "▶";

  }


  if (metronomeText) {

    metronomeText.textContent =
      "Metronom starten";

  }

}



/* =========================================================
   METRONOM BUTTON
   ========================================================= */

if (metronomeStart) {

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

}



/* =========================================================
   METRONOM BEIM EINKLAPPEN STOPPEN
   ========================================================= */

if (metronomeArea) {

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

}



/* =========================================================
   STIMMGERÄT
   FÜRST-PLESS-HORN IN B
   ========================================================= */

const tunerArea =
  document.getElementById("tuner");

const tunerStart =
  document.getElementById("tunerStart");

const tunerStartText =
  document.getElementById(
    "tunerStartText"
  );

const tunerStartSymbol =
  document.getElementById(
    "tunerStartSymbol"
  );

const tunerNote =
  document.getElementById(
    "tunerNote"
  );

const tunerCents =
  document.getElementById(
    "tunerCents"
  );

const tunerFrequency =
  document.getElementById(
    "tunerFrequency"
  );

const tunerNeedle =
  document.getElementById(
    "tunerNeedle"
  );

const tunerStatus =
  document.getElementById(
    "tunerStatus"
  );


let tunerRunning = false;

let tunerAudioContext = null;

let tunerAnalyser = null;

let tunerSource = null;

let tunerStream = null;

let tunerAnimationFrame = null;



/* =========================================================
   NATURTÖNE DES FÜRST-PLESS-HORNS IN B

   "name" entspricht der notierten Tonhöhe.
   "frequency" ist die klingende Sollfrequenz.
   ========================================================= */

const plessNaturalTones = [

  {
    partial: 2,
    hornTone: 1,
    name: "C",
    frequency: 233.08
  },

  {
    partial: 3,
    hornTone: 2,
    name: "G",
    frequency: 349.62
  },

  {
    partial: 4,
    hornTone: 3,
    name: "C",
    frequency: 466.16
  },

  {
    partial: 5,
    hornTone: 4,
    name: "E",
    frequency: 582.70
  },

  {
    partial: 6,
    hornTone: 5,
    name: "G",
    frequency: 699.24
  },

  {
    partial: 7,
    hornTone: 6,
    name: "A",
    frequency: 815.78
  },

  {
    partial: 8,
    hornTone: 7,
    name: "C",
    frequency: 932.32
  }

];



/* =========================================================
   NÄCHSTEN NATURTON FINDEN
   ========================================================= */

function findClosestNaturalTone(
  frequency
) {

  let closestTone =
    plessNaturalTones[0];


  let smallestDifference =
    Infinity;


  plessNaturalTones.forEach(
    (tone) => {

      const difference =
        Math.abs(

          1200 *

          Math.log2(
            frequency /
            tone.frequency
          )

        );


      if (
        difference <
        smallestDifference
      ) {

        smallestDifference =
          difference;

        closestTone =
          tone;

      }

    }
  );


  return closestTone;

}



/* =========================================================
   CENT-ABWEICHUNG ZUM NATURTON
   ========================================================= */

function centsFromFrequency(
  frequency,
  targetFrequency
) {

  return (

    1200 *

    Math.log2(
      frequency /
      targetFrequency
    )

  );

}



/* =========================================================
   AUTOKORRELATION
   Grundfrequenz des Mikrofonsignals bestimmen
   ========================================================= */

function autoCorrelate(
  buffer,
  sampleRate
) {

  const size =
    buffer.length;


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
     Signal zu leise.
  */

  if (rms < 0.01) {

    return -1;

  }


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
      Math.abs(
        buffer[i]
      ) < threshold
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
        buffer[
          size - i
        ]
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


  if (
    trimmedSize < 2
  ) {

    return -1;

  }


  const correlations =
    new Array(
      trimmedSize
    ).fill(0);


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


  let d = 0;


  while (
    d + 1 <
      correlations.length &&
    correlations[d] >
      correlations[d + 1]
  ) {

    d++;

  }


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
   STIMMGERÄT-ANZEIGE
   ========================================================= */

function updateTunerDisplay(
  frequency
) {

  const targetTone =
    findClosestNaturalTone(
      frequency
    );


  const cents =
    centsFromFrequency(
      frequency,
      targetTone.frequency
    );


  /*
     Notierter Ton.
  */

  if (tunerNote) {

    tunerNote.textContent =
      targetTone.name;

  }


  /*
     Gemessene Frequenz und Naturton-Sollwert.
  */

  if (tunerFrequency) {

    tunerFrequency.innerHTML =

      frequency.toLocaleString(
        "de-DE",
        {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }
      ) +

      " Hz" +

      "<br>" +

      "<span>" +

      "Soll: " +

      targetTone.frequency.toLocaleString(
        "de-DE",
        {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }
      ) +

      " Hz · " +

      targetTone.hornTone +

      ". Ton" +

      "</span>";

  }


  /*
     Cent-Anzeige.
  */

  const roundedCents =
    Math.round(cents);


  if (tunerCents) {

    if (
      roundedCents > 0
    ) {

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

  }


  /*
     Nadel:
     -50 Cent links
       0 Cent Mitte
     +50 Cent rechts
  */

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


  if (tunerNeedle) {

    tunerNeedle.style.left =
      needlePosition + "%";

  }


  /*
     Status.
     ±5 Cent gelten zunächst als passend.
  */

  if (tunerStatus) {

    tunerStatus
      .classList
      .remove(
        "in-tune"
      );


    if (
      Math.abs(cents) <= 5
    ) {

      tunerStatus.textContent =
        "✓ " +
        targetTone.hornTone +
        ". Ton passt";


      tunerStatus
        .classList
        .add(
          "in-tune"
        );

    }

    else if (
      cents < -5
    ) {

      tunerStatus.textContent =
        targetTone.hornTone +
        ". Ton ist zu tief";

    }

    else {

      tunerStatus.textContent =
        targetTone.hornTone +
        ". Ton ist zu hoch";

    }

  }

}



/* =========================================================
   STIMMGERÄT ZURÜCKSETZEN
   ========================================================= */

function resetTunerDisplay() {

  if (tunerNote) {

    tunerNote.textContent =
      "–";

  }


  if (tunerCents) {

    tunerCents.textContent =
      tunerRunning
        ? "Kein stabiler Ton"
        : "Mikrofon nicht aktiv";

  }


  if (tunerFrequency) {

    tunerFrequency.textContent =
      "– Hz";

  }


  if (tunerNeedle) {

    tunerNeedle.style.left =
      "50%";

  }


  if (tunerStatus) {

    tunerStatus.textContent =
      "Spiele einen gleichmäßigen Ton.";


    tunerStatus
      .classList
      .remove(
        "in-tune"
      );

  }

}



/* =========================================================
   MIKROFONSIGNAL ANALYSIEREN
   ========================================================= */

function analyseTuner() {

  if (
    !tunerRunning ||
    !tunerAnalyser ||
    !tunerAudioContext
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
     Bereich passend zu unseren Naturtönen.
  */

  if (
    frequency > 180 &&
    frequency < 1050
  ) {

    updateTunerDisplay(
      frequency
    );

  }

  else {

    resetTunerDisplay();

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

  /*
     Metronom stoppen, damit dessen Klick
     nicht vom Mikrofon erkannt wird.
  */

  if (metronomeRunning) {

    stopMetronome();

  }


  /*
     Laufende Musik ebenfalls stoppen.
  */

  players.forEach((player) => {
    player.pause();
  });


  /*
     Browser muss Mikrofonzugriff unterstützen.
  */

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    if (tunerStatus) {

      tunerStatus.textContent =
        "Dieser Browser unterstützt keinen Mikrofonzugriff.";

    }

    return;

  }


  try {

    tunerStream =

      await navigator.mediaDevices
        .getUserMedia({

          audio: {

            echoCancellation:
              false,

            noiseSuppression:
              false,

            autoGainControl:
              false

          }

        });


    tunerAudioContext =

      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();


    if (
      tunerAudioContext.state ===
      "suspended"
    ) {

      await tunerAudioContext.resume();

    }


    tunerAnalyser =
      tunerAudioContext
        .createAnalyser();


    /*
       Größerer Puffer für tiefere Hornfrequenzen.
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


    tunerRunning =
      true;


    if (tunerStart) {

      tunerStart
        .classList
        .add(
          "running"
        );

    }


    if (tunerStartSymbol) {

      tunerStartSymbol.textContent =
        "■";

    }


    if (tunerStartText) {

      tunerStartText.textContent =
        "Mikrofon stoppen";

    }


    if (tunerStatus) {

      tunerStatus.textContent =
        "Spiele einen gleichmäßigen Ton.";

    }


    analyseTuner();

  }

  catch (error) {

    console.error(
      "Mikrofon konnte nicht gestartet werden:",
      error
    );


    if (tunerStatus) {

      if (
        error.name ===
        "NotAllowedError"
      ) {

        tunerStatus.textContent =
          "Mikrofonzugriff wurde nicht erlaubt.";

      }

      else if (
        error.name ===
        "NotFoundError"
      ) {

        tunerStatus.textContent =
          "Kein Mikrofon gefunden.";

      }

      else {

        tunerStatus.textContent =
          "Mikrofon konnte nicht gestartet werden.";

      }

    }


    if (tunerCents) {

      tunerCents.textContent =
        "Bitte Mikrofonfreigabe prüfen.";

    }

  }

}



/* =========================================================
   STIMMGERÄT STOPPEN
   ========================================================= */

function stopTuner() {

  tunerRunning =
    false;


  if (
    tunerAnimationFrame
  ) {

    cancelAnimationFrame(
      tunerAnimationFrame
    );


    tunerAnimationFrame =
      null;

  }


  if (tunerStream) {

    tunerStream
      .getTracks()
      .forEach((track) => {

        track.stop();

      });


    tunerStream =
      null;

  }


  if (tunerSource) {

    try {

      tunerSource.disconnect();

    }

    catch (error) {

      /*
         Verbindung war bereits getrennt.
      */

    }


    tunerSource =
      null;

  }


  if (tunerAudioContext) {

    tunerAudioContext.close();


    tunerAudioContext =
      null;

  }


  tunerAnalyser =
    null;


  resetTunerDisplay();


  if (tunerStart) {

    tunerStart
      .classList
      .remove(
        "running"
      );

  }


  if (tunerStartSymbol) {

    tunerStartSymbol.textContent =
      "●";

  }


  if (tunerStartText) {

    tunerStartText.textContent =
      "Mikrofon starten";

  }

}



/* =========================================================
   STIMMGERÄT START / STOP BUTTON
   ========================================================= */

if (tunerStart) {

  tunerStart.addEventListener(
    "click",
    () => {

      if (tunerRunning) {

        stopTuner();

      }

      else {

        startTuner();

      }

    }
  );

}



/* =========================================================
   STIMMGERÄT BEIM EINKLAPPEN STOPPEN
   ========================================================= */

if (tunerArea) {

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

}

/* =========================================================
   APP IM HINTERGRUND

   Musik, Metronom und Mikrofon stoppen,
   sobald die App nicht mehr sichtbar ist.
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (!document.hidden) {
      return;
    }


    /* Musik pausieren */

    players.forEach((player) => {
      player.pause();
    });


    /* Metronom stoppen */

    if (metronomeRunning) {
      stopMetronome();
    }


    /* Stimmgerät stoppen und Mikrofon freigeben */

    if (tunerRunning) {
      stopTuner();
    }

  }
);

/* =========================================================
   SERVICE WORKER
   ========================================================= */

if (
  "serviceWorker"
  in navigator
) {

  window.addEventListener(
    "load",
    () => {

      navigator
        .serviceWorker
        .register(
          "./sw.js"
        )

        .then(() => {

          console.log(
            "Service Worker aktiv."
          );

        })

        .catch((error) => {

          console.error(
            "Service Worker Fehler:",
            error
          );

        });

    }
  );

}

/* =========================================================
   AUDIO STOPPEN, WENN DIE APP VERLASSEN WIRD
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    /*
       Sobald die App bzw. Browserseite
       nicht mehr sichtbar ist:
    */

    if (document.hidden) {

      /*
         Alle Musikaufnahmen pausieren.
      */

      players.forEach((player) => {
        player.pause();
      });


      /*
         Metronom stoppen.
      */

      if (metronomeRunning) {
        stopMetronome();
      }


      /*
         Stimmgerät und Mikrofon stoppen.
      */

      if (tunerRunning) {
        stopTuner();
      }

    }

  }
);
