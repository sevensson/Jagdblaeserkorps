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
