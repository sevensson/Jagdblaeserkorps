/* =========================================================
   JAGDBLÄSERCORPS HEGERING RADEVORMWALD
   MUSIKBIBLIOTHEK

   FP = Fürst-Pless-Horn
   PF = Parforcehorn

   audio:
   Dateiname der Gesamtaufnahme

   voices:
   Einzelstimmen zum Üben
   ========================================================= */

const musicLibrary = [

  /* =======================================================
     ALLGEMEINE SIGNALE
     ======================================================= */

  {
    title: "Das hohe Wecken",
    category: "allgemeine-signale",
    page: 4,
    audio: "Das hohe Wecken.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Das hohe Wecken-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Das hohe Wecken-FP2.mp3"
      }
    ]
  },

  {
    title: "Begrüßung",
    category: "allgemeine-signale",
    page: 5,
    audio: "Begrüßung.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Begrüßung-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Begrüßung-FP2.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "3. Stimme",
        file: "Begrüßung-FP3.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "4. Stimme",
        file: "Begrüßung-FP4.mp3"
      }
    ]
  },

  {
    title: "Zum Essen",
    category: "allgemeine-signale",
    page: 6,
    audio: null,
    voices: []
  },

  {
    title: "Blattschlagen",
    category: "allgemeine-signale",
    page: 6,
    audio: "Blattschlagen.mp3",
    voices: []
  },

  {
    title: "Jagd vorbei",
    category: "allgemeine-signale",
    page: 6,
    audio: null,
    voices: []
  },

  {
    title: "Zum Trinken",
    category: "allgemeine-signale",
    page: 7,
    audio: null,
    voices: []
  },

  {
    title: "Horrido",
    category: "allgemeine-signale",
    page: 8,
    audio: null,
    voices: []
  },

  {
    title: "Halali",
    category: "allgemeine-signale",
    page: 9,
    audio: "Halali.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Halali-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Halali-FP2.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "3. Stimme",
        file: "Halali-FP3.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "4. Stimme",
        file: "Halali-FP4.mp3"
      }
    ]
  },


  /* =======================================================
     JAGDLEITSIGNALE
     ======================================================= */

  {
    title: "Hegeruf",
    category: "jagdleitsignale",
    page: 10,
    audio: null,
    voices: []
  },

  {
    title: "Antwort",
    category: "jagdleitsignale",
    page: 10,
    audio: "Antwort.mp3",
    voices: []
  },

  {
    title: "Notruf",
    category: "jagdleitsignale",
    page: 10,
    audio: null,
    voices: []
  },

  {
    title: "Das Ganze",
    category: "jagdleitsignale",
    page: 10,
    audio: "Das Ganze.mp3",
    voices: []
  },

  {
    title: "Aufbruch zur Jagd",
    category: "jagdleitsignale",
    page: 10,
    audio: "Aufbruch zur Jagd.mp3",
    voices: []
  },

  {
    title: "Anblasen des Treibens",
    category: "jagdleitsignale",
    page: 10,
    audio: "Anblasen des Treibens.mp3",
    voices: []
  },

  {
    title: "Laut treiben",
    category: "jagdleitsignale",
    page: 10,
    audio: null,
    voices: []
  },

  {
    title: "Aufmunterung zum Treiben",
    category: "jagdleitsignale",
    page: 11,
    audio: "Aufmunterung zum Treiben.mp3",
    voices: []
  },

  {
    title: "Stumm treiben",
    category: "jagdleitsignale",
    page: 11,
    audio: null,
    voices: []
  },

  {
    title: "Halt",
    category: "jagdleitsignale",
    page: 11,
    audio: "Halt.mp3",
    voices: []
  },

  {
    title: "Treiber in den Kessel",
    category: "jagdleitsignale",
    page: 11,
    audio: null,
    voices: []
  },

  {
    title: "Treiben zurück",
    category: "jagdleitsignale",
    page: 11,
    audio: null,
    voices: []
  },

  {
    title: "Aufhören zu schießen (Abblasen des Treibens)",
    category: "jagdleitsignale",
    page: 11,
    audio: "Aufhören zu schießen.mp3",
    voices: []
  },

  {
    title: "Sammeln der Jäger",
    category: "jagdleitsignale",
    page: 11,
    audio: null,
    voices: []
  },

  {
    title: "Hunderuf",
    category: "jagdleitsignale",
    page: 12,
    audio: null,
    voices: []
  },

  {
    title: "Wagenruf",
    category: "jagdleitsignale",
    page: 12,
    audio: null,
    voices: []
  },


  /* =======================================================
     TOTSIGNALE
     ======================================================= */

  {
    title: "Hirsch tot",
    category: "totsignale",
    page: 13,
    audio: null,
    voices: []
  },

  {
    title: "Damhirsch tot",
    category: "totsignale",
    page: 13,
    audio: "Damhirsch tot.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Damhirsch tot-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Damhirsch tot-FP2.mp3"
      }
    ]
  },

  {
    title: "Muffel tot",
    category: "totsignale",
    page: 14,
    audio: null,
    voices: []
  },

  {
    title: "Sau tot",
    category: "totsignale",
    page: 15,
    audio: null,
    voices: []
  },

  {
    title: "Reh tot",
    category: "totsignale",
    page: 15,
    audio: null,
    voices: []
  },

  {
    title: "Fuchs tot",
    category: "totsignale",
    page: 16,
    audio: "Fuchs tot.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Fuchs tot-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Fuchs tot-FP2.mp3"
      }
    ]
  },

  {
    title: "Waschbär tot",
    category: "totsignale",
    page: 16,
    audio: null,
    voices: []
  },

  {
    title: "Dachs tot",
    category: "totsignale",
    page: 17,
    audio: "Dachs tot.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Dachs tot-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Dachs tot-FP2.mp3"
      }
    ]
  },

  {
    title: "Hase tot",
    category: "totsignale",
    page: 17,
    audio: "Hase tot.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Hase tot-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Hase tot-FP2.mp3"
      }
    ]
  },

  {
    title: "Kaninchen tot",
    category: "totsignale",
    page: 18,
    audio: null,
    voices: []
  },

  {
    title: "Flugwild tot",
    category: "totsignale",
    page: 18,
    audio: "Flugwild tot.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Flugwild tot-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Flugwild tot-FP2.mp3"
      }
    ]
  },

  {
    title: "Raubwild tot",
    category: "totsignale",
    page: 18,
    audio: null,
    voices: []
  },

  {
    title: "Nutria tot",
    category: "totsignale",
    page: 19,
    audio: null,
    voices: []
  },


  /* =======================================================
     MÄRSCHE & STÜCKE
     ======================================================= */

  {
    title: "Ehrenfanfare",
    category: "maersche",
    page: 20,
    audio: "Ehrenfanfare.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Ehrenfanfare-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Ehrenfanfare-FP2.mp3"
      }
    ]
  },

  {
    title: "Teckel-Fanfare",
    category: "maersche",
    page: 21,
    audio: null,
    voices: []
  },

  {
    title: "Jägermarsch Nr. 3",
    category: "maersche",
    page: 22,
    audio: null,
    voices: []
  },

  {
    title: "Hubertusmarsch",
    category: "maersche",
    page: 23,
    audio: "Hubertusmarsch.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Hubertusmarsch-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Hubertusmarsch-FP2.mp3"
      }
    ]
  },

  {
    title: "Alpenjägermarsch",
    category: "maersche",
    page: 24,
    audio: "Alpenjägermarsch.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Alpenjägermarsch-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Alpenjägermarsch-FP2.mp3"
      }
    ]
  },

  {
    title: "Ländler",
    category: "maersche",
    page: 25,
    audio: null,
    voices: []
  },

  {
    title: "Hegewaldfanfare",
    category: "maersche",
    page: 26,
    audio: null,
    voices: []
  },

  {
    title: "Auf zum fröhlichen Jagen",
    category: "maersche",
    page: 27,
    audio: "Auf zum fröhlichen Jagen.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Auf zum fröhlichen Jagen-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Auf zum fröhlichen Jagen-FP2.mp3"
      }
    ]
  },


  /* =======================================================
     WEITERE GEBRÄUCHLICHE SIGNALE
     ======================================================= */

  {
    title: "Weckruf",
    category: "weitere-signale",
    page: 28,
    audio: null,
    voices: []
  },

  {
    title: "Hoch soll er leben",
    category: "weitere-signale",
    page: 28,
    audio: null,
    voices: []
  },

  {
    title: "Zapfenstreich",
    category: "weitere-signale",
    page: 28,
    audio: null,
    voices: []
  },

  {
    title: "Auf Wiedersehen",
    category: "weitere-signale",
    page: 29,
    audio: "Auf Wiedersehen.mp3",
    voices: [
      {
        instrument: "Fürst-Pless-Horn",
        voice: "1. Stimme",
        file: "Auf Wiedersehen-FP1.mp3"
      },
      {
        instrument: "Fürst-Pless-Horn",
        voice: "2. Stimme",
        file: "Auf Wiedersehen-FP2.mp3"
      }
    ]
  },

  {
    title: "Hornruf der Falkner",
    category: "weitere-signale",
    page: 29,
    audio: null,
    voices: []
  }

];
