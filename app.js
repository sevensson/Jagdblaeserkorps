/* =========================================================
   JAGDBLÄSERCORPS HEGERING RADEVORMWALD
   APP.JS
   ========================================================= */


/* =========================================================
   MUSIKBIBLIOTHEK
   ========================================================= */

/*
   Die eigentlichen Musikdaten stehen in:
   music-library.js

   Hier legen wir nur fest, welcher category-Wert
   in welchen Bereich der index.html gehört.
*/

const libraryTargets = {

  "maersche":
    "maerscheLibrary",

  "allgemeine-signale":
    "allgemeineSignaleLibrary",

  "jagdleitsignale":
    "jagdleitsignaleLibrary",

  "totsignale":
    "totsignaleLibrary",

  "weitere-signale":
    "weitereSignaleLibrary"

};


/* =========================================================
   HILFSFUNKTION:
   HTML-Sonderzeichen absichern
   ========================================================= */

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   HILFSFUNKTION:
   INSTRUMENTE GRUPPIEREN
   ========================================================= */

function groupVoicesByInstrument(voices) {

  const groups = {};


  voices.forEach((voice) => {

    const instrument =
      voice.instrument ||
      "Weitere Stimme";


    if (!groups[instrument]) {

      groups[instrument] = [];

    }


    groups[instrument].push(
      voice
    );

  });


  return groups;

}


/* =========================================================
   EINZELNE STIMME ERZEUGEN
   ========================================================= */

function createVoiceHtml(
  voice,
  index
) {

  const voiceName =
    voice.voice ||
    `${index + 1}. Stimme`;


  const instrument =
    voice.instrument ||
    "";


  return `

    <div class="voice-card">

      <div class="voice-header">

        <div class="voice-number">
          ${index + 1}
        </div>

        <div class="voice-title">

          <strong>
            ${escapeHtml(voiceName)}
          </strong>

          <span>
            ${escapeHtml(instrument)}
          </span>

        </div>

      </div>

      <audio
        class="audio-player voice-player"
        controls
        preload="metadata"
      >

        <source
          src="audio/${escapeHtml(voice.file)}"
          type="audio/mpeg"
        >

        Dein Browser unterstützt die Audiowiedergabe nicht.

      </audio>

    </div>

  `;

}


/* =========================================================
   STIMMENBEREICH ERZEUGEN
   ========================================================= */

function createPracticeHtml(voices) {

  if (
    !Array.isArray(voices) ||
    voices.length === 0
  ) {

    return "";

  }


  const groups =
    groupVoicesByInstrument(
      voices
    );


  let groupsHtml = "";


  Object.entries(groups)
    .forEach(
      ([instrument, instrumentVoices]) => {

        const voicesHtml =
          instrumentVoices
            .map(
              (voice, index) =>
                createVoiceHtml(
                  voice,
                  index
                )
            )
            .join("");


        groupsHtml += `

          <div class="instrument-heading">

            <span class="instrument-line"></span>

            <span>
              ${escapeHtml(instrument)}
            </span>

            <span class="instrument-line"></span>

          </div>

          ${voicesHtml}

        `;

      }
    );


  return `

    <details class="practice-area">

      <summary>

        <div class="practice-summary-left">

          <div class="practice-symbol">
            ♫
          </div>

          <div>

            <span class="practice-small">
              Übungsmodus
            </span>

            <strong>
              Stimmen einzeln üben
            </strong>

          </div>

        </div>

        <span class="practice-chevron">
          ›
        </span>

      </summary>


      <div class="practice-content">

        ${groupsHtml}

        <div class="practice-tip">

          <span class="tip-icon">
            ♪
          </span>

          <p>
            Höre deine Stimme zunächst einzeln an und
            spiele anschließend zur Aufnahme mit.
          </p>

        </div>

      </div>

    </details>

  `;

}


/* =========================================================
   STÜCK-KARTE ERZEUGEN
   ========================================================= */

function createPieceCard(
  piece,
  number
) {

  const card =
    document.createElement(
      "details"
    );


  card.className =
    "piece-card audio-card";


  const displayNumber =
    String(number)
      .padStart(
        2,
        "0"
      );


  const practiceHtml =
    createPracticeHtml(
      piece.voices || []
    );


  card.innerHTML = `

    <summary class="piece-summary">

      <div class="audio-heading">

        <div class="track-number">
          ${displayNumber}
        </div>

        <div class="track-info">

          <h3>
            ${escapeHtml(piece.title)}
          </h3>

          <p>
            Seite ${escapeHtml(piece.page)}
          </p>

        </div>

      </div>

      <div class="piece-chevron">
        ›
      </div>

    </summary>


    <div class="piece-content">


      <div class="playback-speed">

        <div class="speed-header">

          <span class="speed-label">
            Wiedergabetempo
          </span>

          <span class="speed-description">
            Tempo zum Üben auswählen
          </span>

        </div>


        <div class="speed-buttons">

          <button
            class="speed-button"
            type="button"
            data-speed="0.7"
          >
            <span>70</span>
            <small>%</small>
          </button>

          <button
            class="speed-button"
            type="button"
            data-speed="0.8"
          >
            <span>80</span>
            <small>%</small>
          </button>

          <button
            class="speed-button"
            type="button"
            data-speed="0.9"
          >
            <span>90</span>
            <small>%</small>
          </button>

          <button
            class="speed-button active"
            type="button"
            data-speed="1"
          >
            <span>100</span>
            <small>%</small>
          </button>

        </div>


        <div class="speed-hint">

          <span class="speed-hint-icon">
            ♪
          </span>

          <span>
            Tonhöhe bleibt beim langsameren
            Abspielen erhalten.
          </span>

        </div>

      </div>


      <div class="main-recording">

        <span class="audio-label">
          Gesamtaufnahme
        </span>

        <audio
          class="audio-player"
          controls
          preload="metadata"
        >

          <source
            src="audio/${escapeHtml(piece.audio)}"
            type="audio/mpeg"
          >

          Dein Browser unterstützt die Audiowiedergabe nicht.

        </audio>

      </div>


      ${practiceHtml}


    </div>

  `;


  return card;

}


/* =========================================================
   MUSIKBIBLIOTHEK ANZEIGEN
   ========================================================= */

function renderMusicLibrary() {

  /*
     Falls music-library.js aus irgendeinem Grund
     nicht geladen wurde, brechen wir sauber ab.
  */

  if (
    typeof musicLibrary ===
    "undefined"
  ) {

    console.error(
      "music-library.js wurde nicht geladen."
    );

    return;

  }


  Object.entries(
    libraryTargets
  ).forEach(
    ([category, targetId]) => {

      const target =
        document.getElementById(
          targetId
        );


      if (!target) {
        return;
      }


      /*
         Nur Stücke dieser Kategorie anzeigen,
         für die bereits eine Gesamtaufnahme
         eingetragen wurde.
      */

      const pieces =
        musicLibrary.filter(
          (piece) =>
            piece.category === category &&
            piece.audio
        );


      target.innerHTML = "";


      pieces.forEach(
        (piece, index) => {

          const card =
            createPieceCard(
              piece,
              index + 1
            );


          target.appendChild(
            card
          );

        }
      );

    }
  );

}


/*
   Jetzt werden die Karten tatsächlich erzeugt.
*/

renderMusicLibrary();



/* =========================================================
   AUDIOPLAYER

   WICHTIG:
   Die Audioplayer existieren erst NACH
   renderMusicLibrary().
   ========================================================= */

const players =
  document.querySelectorAll(
    "audio"
  );


players.forEach((player) => {

  /*
     Tonhöhe beim Verändern der
     Wiedergabegeschwindigkeit erhalten.
  */

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


  /*
     Immer nur eine Aufnahme gleichzeitig.
  */

  player.addEventListener(
    "play",
    () => {

      players.forEach(
        (otherPlayer) => {

          if (
            otherPlayer !==
            player
          ) {

            otherPlayer.pause();

          }

        }
      );


      /*
         Falls das Metronom läuft,
         wird es gestoppt.
      */

      if (
        typeof metronomeRunning !==
          "undefined" &&
        metronomeRunning
      ) {

        stopMetronome();

      }


      /*
         Falls das Stimmgerät läuft,
         Mikrofon stoppen.
      */

      if (
        typeof tunerRunning !==
          "undefined" &&
        tunerRunning
      ) {

        stopTuner();

      }

    }
  );

});



/* =========================================================
   STÜCKE

   Beim Einklappen alle Aufnahmen des
   jeweiligen Stücks stoppen.
   ========================================================= */

const pieceCards =
  document.querySelectorAll(
    ".piece-card"
  );


pieceCards.forEach((pieceCard) => {

  pieceCard.addEventListener(
    "toggle",
    () => {

      if (!pieceCard.open) {

        const piecePlayers =
          pieceCard.querySelectorAll(
            "audio"
          );


        piecePlayers.forEach(
          (player) => {

            player.pause();

          }
        );


        /*
           Geöffneten Stimmenbereich
           ebenfalls schließen.
        */

        const piecePracticeAreas =
          pieceCard.querySelectorAll(
            ".practice-area"
          );


        piecePracticeAreas.forEach(
          (area) => {

            area.open = false;

          }
        );

      }

    }
  );

});



/* =========================================================
   STIMMEN-ÜBUNGSBEREICHE
   ========================================================= */

const practiceAreas =
  document.querySelectorAll(
    ".practice-area"
  );


practiceAreas.forEach((area) => {

  area.addEventListener(
    "toggle",
    () => {

      if (!area.open) {

        const voicePlayers =
          area.querySelectorAll(
            "audio"
          );


        voicePlayers.forEach(
          (player) => {

            player.pause();

          }
        );

      }

    }
  );

});



/* =========================================================
   WIEDERGABEGESCHWINDIGKEIT

   Gilt immer für Gesamtaufnahme UND
   Einzelstimmen des jeweiligen Stücks.
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


        piecePlayers.forEach(
          (player) => {

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

          }
        );


        speedButtons.forEach(
          (otherButton) => {

            otherButton
              .classList
              .remove(
                "active"
              );

          }
        );


        button
          .classList
          .add(
            "active"
          );

      }
    );

  });

});



/* =========================================================
   METRONOM
   ========================================================= */

const bpmDisplay =
  document.getElementById(
    "bpmDisplay"
  );

const bpmSlider =
  document.getElementById(
    "bpmSlider"
  );

const bpmMinus =
  document.getElementById(
    "bpmMinus"
  );

const bpmPlus =
  document.getElementById(
    "bpmPlus"
  );

const metronomeStart =
  document.getElementById(
    "metronomeStart"
  );

const metronomeText =
  document.getElementById(
    "metronomeText"
  );

const metronomeSymbol =
  document.getElementById(
    "metronomeSymbol"
  );

const beatIndicator =
  document.getElementById(
    "beatIndicator"
  );

const timeButtons =
  document.querySelectorAll(
    ".time-button"
  );

const metronomeArea =
  document.getElementById(
    "metronome"
  );


let bpm = 100;

let beatsPerMeasure = 4;

let beatNote = 4;

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
      document.createElement(
        "span"
      );


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


      beatNote =
        Number(
          button.dataset.note || 4
        );


      timeButtons.forEach(
        (otherButton) => {

          otherButton
            .classList
            .remove(
              "active"
            );

        }
      );


      button
        .classList
        .add(
          "active"
        );


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


  oscillator.connect(
    gain
  );

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


  oscillator.start(
    now
  );

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
      .add(
        "current"
      );

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


  metronomeRunning =
    true;

  currentBeat =
    0;


  startTimer();


  if (metronomeStart) {

    metronomeStart
      .classList
      .add(
        "running"
      );

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

  metronomeRunning =
    false;

  currentBeat =
    0;


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
      .remove(
        "running"
      );

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
  document.getElementById(
    "tuner"
  );

const tunerStart =
  document.getElementById(
    "tunerStart"
  );

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


let tunerRunning =
  false;

let tunerAudioContext =
  null;

let tunerAnalyser =
  null;

let tunerSource =
  null;

let tunerStream =
  null;

let tunerAnimationFrame =
  null;


/* =========================================================
   NATURTÖNE DER HÖRNER

   Anzeige:
   Notierte Jagdhornnotation

   Frequenz:
   klingende Sollfrequenz

   ========================================================= */


const tuningProfiles = {


  fuerstPless: {

    name: "Fürst-Pless-Horn in B",

    notes: [

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
        frequency: 582.70,
        info: "Terz etwas tief"
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

    ]

  },


  parforceB: {

    name: "Parforcehorn in B",

    notes: [

      {
        partial: 1,
        hornTone: 0,
        name: "C",
        frequency: 58.3,
        info: "Grundton"
      },

      {
        partial: 2,
        hornTone: 1,
        name: "C",
        frequency: 116.5
      },

      {
        partial: 3,
        hornTone: 2,
        name: "G",
        frequency: 174.8
      },

      {
        partial: 4,
        hornTone: 3,
        name: "C",
        frequency: 233.1
      },

      {
        partial: 5,
        hornTone: 4,
        name: "E",
        frequency: 291.4,
        info: "Terz -14 Cent"
      },

      {
        partial: 6,
        hornTone: 5,
        name: "G",
        frequency: 349.6
      },

      {
        partial: 7,
        hornTone: 6,
        name: "B",
        frequency: 407.9,
      
        special: true,
      
        intonation: "Natur-Septime",
      
        expectedDeviation: -31,
      
        info: "bewusst tief"
      },

      {
        partial: 8,
        hornTone: 7,
        name: "C",
        frequency: 466.2
      },

      {
        partial: 9,
        hornTone: 8,
        name: "D",
        frequency: 524.4
      },

      {
        partial: 10,
        hornTone: 9,
        name: "E",
        frequency: 582.7,
        info: "Terz -14 Cent"
      },

      {
        partial: 11,
        hornTone: 10,
        name: "F",
        frequency: 641.0,
      
        special: true,
      
        intonation: "Alphorn-Fa",
      
        expectedDeviation: -49,
      
        info: "Sondernaturton"
      },

      {
        partial: 12,
        hornTone: 11,
        name: "G",
        frequency: 699.3
      }

    ]

  }

};



let currentTuningProfile =
  "fuerstPless";



/* =========================================================
   INSTRUMENT AUSWAHL
   ========================================================= */


const instrumentSelect =
  document.getElementById(
    "instrumentSelect"
  );


if (instrumentSelect) {

  instrumentSelect.addEventListener(
    "change",
    (event) => {

      currentTuningProfile =
        event.target.value;


      resetTunerDisplay();

    }
  );

}



/* =========================================================
   NÄCHSTEN NATURTON FINDEN
   ========================================================= */


function findClosestNaturalTone(
  frequency
) {


  let closestTone =
    tuningProfiles[currentTuningProfile]
      .notes[0];


  let smallestDifference =
    Infinity;



  tuningProfiles[currentTuningProfile]
    .notes
    .forEach(
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


  if (rms < 0.01) {

    return -1;

  }


  let start =
    0;

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

      start =
        i;

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
    ).fill(
      0
    );


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


  let d =
    0;


  while (
    d + 1 <
      correlations.length &&
    correlations[d] >
      correlations[d + 1]
  ) {

    d++;

  }


  let maxValue =
    -1;

  let maxPosition =
    -1;


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
     Zusatzinformationen
     für besondere Naturtöne
  */

  let specialInfo = "";


  if (
    targetTone.special
  ) {

    specialInfo =

      "<br><small>" +

      targetTone.intonation +

      "<br>" +

      targetTone.info +

      " (" +

      targetTone.expectedDeviation +

      " Cent)" +

      "</small>";

  }



  if (tunerNote) {

    tunerNote.innerHTML =

      targetTone.name +

      specialInfo;

  }



  if (tunerFrequency) {


    tunerFrequency.innerHTML =


      frequency.toLocaleString(
        "de-DE",
        {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }
      )


      +

      " Hz"


      +

      "<br>"


      +

      "<span>"


      +

      "Soll: "


      +

      targetTone.frequency.toLocaleString(
        "de-DE",
        {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }
      )


      +

      " Hz · "


      +

      targetTone.hornTone


      +

      ". Ton"


      +

      specialInfo


      +

      "</span>";

  }




  const roundedCents =
    Math.round(
      cents
    );



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

      needlePosition +

      "%";

  }





  if (tunerStatus) {


    tunerStatus
      .classList
      .remove(
        "in-tune"
      );



    /*
       Sondernaturtöne:
       nicht als Fehler bewerten
    */

    if (
      targetTone.special
    ) {


      tunerStatus.textContent =

        "✓ Naturton getroffen · " +

        targetTone.intonation;



      tunerStatus
        .classList
        .add(
          "in-tune"
        );


    }


    else if (
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
     Metronom stoppen.
  */

  if (metronomeRunning) {

    stopMetronome();

  }


  /*
     Laufende Musik stoppen.
  */

  players.forEach((player) => {

    player.pause();

  });


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


  if (tunerAnimationFrame) {

    cancelAnimationFrame(
      tunerAnimationFrame
    );


    tunerAnimationFrame =
      null;

  }


  if (tunerStream) {

    tunerStream
      .getTracks()
      .forEach(
        (track) => {

          track.stop();

        }
      );


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


    /*
       Musik pausieren.
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
       Stimmgerät stoppen und
       Mikrofon freigeben.
    */

    if (tunerRunning) {

      stopTuner();

    }

  }
);
/* =========================================================
   VERANSTALTUNGEN
   ========================================================= */

function renderEvents() {

  const eventsList =
    document.getElementById("eventsList");

  if (!eventsList) {
    return;
  }


  if (typeof events === "undefined") {

    console.error(
      "events.js wurde nicht geladen."
    );

    return;
  }


  /* HEUTIGES DATUM */

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );


  /* NUR HEUTIGE UND ZUKÜNFTIGE TERMINE */

  const upcomingEvents =
    events
      .filter((event) => {

        const eventDate =
          new Date(
            event.date + "T00:00:00"
          );

        return eventDate >= today;

      })

      .sort((a, b) => {

        const dateA =
          new Date(
            a.date +
            "T" +
            (a.time || "00:00")
          );

        const dateB =
          new Date(
            b.date +
            "T" +
            (b.time || "00:00")
          );

        return dateA - dateB;

      });


  /* KEINE TERMINE */

  if (upcomingEvents.length === 0) {

    eventsList.innerHTML = `

      <div class="no-events">

        <div class="no-events-icon">
          ♫
        </div>

        <div>

          <strong>
            Aktuell keine Termine
          </strong>

          <p>
            Neue Veranstaltungen werden
            hier bekanntgegeben.
          </p>

        </div>

      </div>

    `;

    return;
  }


  /* TERMINE ERZEUGEN */

  eventsList.innerHTML =
    upcomingEvents
      .map((event) =>
        createEventCard(event)
      )
      .join("");

}

/* =========================================================
   ICAL KALENDER EXPORT
   ========================================================= */

function createCalendarFile(event) {


  const start =
    event.date.replaceAll("-", "")
    +
    "T"
    +
    event.time.replace(":", "")
    +
    "00";


  const end =
    event.date.replaceAll("-", "")
    +
    "T235900";


  const ical =

`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${start}
DTEND:${end}
LOCATION:${event.location}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;



  const blob =
    new Blob(
      [ical],
      {
        type: "text/calendar"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;


  link.download =
    event.title + ".ics";


  document.body.appendChild(link);


  link.click();


  document.body.removeChild(link);


  URL.revokeObjectURL(url);

}

/* =========================================================
   TERMIN-KARTE
   ========================================================= */

function createEventCard(event) {

  const eventDate =
    new Date(
      event.date + "T00:00:00"
    );


  const day =
    String(
      eventDate.getDate()
    ).padStart(
      2,
      "0"
    );


  const month =
    eventDate
      .toLocaleDateString(
        "de-DE",
        {
          month: "short"
        }
      )
      .replace(".", "")
      .toUpperCase();


  const weekday =
    eventDate
      .toLocaleDateString(
        "de-DE",
        {
          weekday: "long"
        }
      );


  let detailsHtml = "";


  /* UHRZEIT */

  if (event.time) {

    detailsHtml += `

      <div class="event-detail">

        <span class="event-detail-icon">
          ◷
        </span>

        <span>
          ${escapeHtml(event.time)} Uhr
        </span>

      </div>

    `;

  }


  /* TREFFZEIT */

  if (event.meetingTime) {

    detailsHtml += `

      <div class="event-detail">

        <span class="event-detail-icon">
          ●
        </span>

        <span>
          Treffen:
          ${escapeHtml(event.meetingTime)} Uhr
        </span>

      </div>

    `;

  }


  /* ORT */

  if (event.location) {

    detailsHtml += `

      <div class="event-detail">

        <span class="event-detail-icon">
          ◆
        </span>

        <span>
          ${escapeHtml(event.location)}
        </span>

      </div>

    `;

  }


  /* KLEIDUNG */

  if (event.clothing) {

    detailsHtml += `

      <div class="event-detail">

        <span class="event-detail-icon">
          ◇
        </span>

        <span>
          ${escapeHtml(event.clothing)}
        </span>

      </div>

    `;

  }



`;

/* BESCHREIBUNG */

const descriptionHtml =
  event.description
    ? `

      <p class="event-description">
        ${escapeHtml(event.description)}
      </p>

    `
    : "";



/* BUTTONS */

const buttonsHtml = `

<div class="event-buttons">


${
event.maps

?

`

<a
href="${event.maps}"
target="_blank"
class="event-button"
>
📍 Route
</a>

`

:

""

}



<button
class="event-button"
onclick='createCalendarFile(${JSON.stringify(event)})'
>
📅 Kalender
</button>


</div>

`;



return `

    <article class="event-card">

      <div class="event-date">

        <strong>
          ${day}
        </strong>

        <span>
          ${month}
        </span>

      </div>


      <div class="event-information">

        <span class="event-weekday">
          ${escapeHtml(weekday)}
        </span>

        <h3>
          ${escapeHtml(event.title)}
        </h3>


        <div class="event-details">
          ${detailsHtml}
        </div>


       ${descriptionHtml}

${buttonsHtml}

      </div>

    </article>

  `;

}



/* =========================================================
   VERANSTALTUNGEN STARTEN
   ========================================================= */

renderEvents();


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
