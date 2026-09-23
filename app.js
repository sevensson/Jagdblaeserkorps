/* =========================================================
   JAGDBLÄSERCORPS RADEVORMWALD
   Web-App
   ========================================================= */


/* =========================================================
   AUDIOPLAYER
   Es soll immer nur eine Aufnahme gleichzeitig laufen.
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
   ÜBUNGSBEREICHE
   Beim Schließen werden dort laufende Audios gestoppt.
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
   SPÄTER:
   METRONOM
   =========================================================

   Hier kommt als nächster Baustein unser eigenständiges
   Metronom hinein.

   Das Metronom wird unabhängig von den Musikstücken
   funktionieren.

   Geplant:

   - Start / Stop
   - BPM einstellbar
   - Plus / Minus
   - Slider
   - Taktarten
   - Betonung des ersten Taktschlags
   - optische Taktschlag-Anzeige

   ========================================================= */
