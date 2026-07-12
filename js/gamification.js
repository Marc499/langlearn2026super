/**
 * Gamification: Smiley-Reaktionen, Sounds und Streaks (Erfolgsserien)
 * für richtige und falsche Antworten im Lernbereich.
 *
 * - Richtige Antwort: fröhlicher Smiley (steigert sich mit der Serie) + Erfolgs-Sound
 * - Falsche Antwort: trauriger Smiley + Fehl-Sound + Vibration
 * - Serien-Meilensteine (5, 10, 15 ...): Emoji-Konfetti + Fanfare
 * - Sounds werden per Web Audio API erzeugt (keine Audiodateien nötig)
 *   und können über den 🔊-Button an-/ausgeschaltet werden.
 */

const GAMIFY = (function () {
  'use strict';

  const SOUND_KEY = 'thaiapp_sound';
  const BEST_KEY_PREFIX = 'thaiapp_beststreak_';

  let streak = 0;      // aktuelle Serie richtiger Antworten
  let failStreak = 0;  // aufeinanderfolgende falsche Antworten

  // ==================== SOUND (Web Audio API) ====================

  let audioCtx = null;

  function soundOn() {
    return localStorage.getItem(SOUND_KEY) !== 'off';
  }

  function setSoundOn(on) {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
  }

  function getCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // Einzelner Ton mit sanfter Lautstärke-Hüllkurve
  function tone(freq, startDelay, duration, type, volume) {
    const ctx = getCtx();
    if (!ctx) return;
    const t0 = ctx.currentTime + startDelay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume || 0.25, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  function playCorrectSound() {
    if (!soundOn()) return;
    tone(523.25, 0, 0.15);        // C5
    tone(783.99, 0.11, 0.22);     // G5
  }

  function playMilestoneSound() {
    if (!soundOn()) return;
    tone(523.25, 0, 0.14);        // C5
    tone(659.25, 0.11, 0.14);     // E5
    tone(783.99, 0.22, 0.14);     // G5
    tone(1046.5, 0.33, 0.35);     // C6
  }

  function playWrongSound() {
    if (!soundOn()) return;
    tone(196, 0, 0.22, 'sawtooth', 0.12);   // G3
    tone(147, 0.2, 0.35, 'sawtooth', 0.12); // D3
  }

  function vibrate(pattern) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) { /* ignorieren */ }
    }
  }

  // ==================== SMILEY-OVERLAY ====================

  const HAPPY_TIERS = [
    ['🙂', '😊'],           // Serie 1
    ['😄', '😃'],           // Serie 2
    ['😁', '🤗'],           // Serie 3-4
    ['🤩', '😎'],           // Serie 5-9
    ['🥳', '🏆', '🤩']      // Serie 10+
  ];
  const SAD_FACES = ['😕', '😟', '😢', '🙈'];

  const HAPPY_TEXTS = ['Richtig!', 'Super!', 'Sehr gut!', 'Toll!', 'Klasse!'];
  const SAD_TEXTS = ['Ups!', 'Leider falsch', 'Nicht ganz ...', 'Gleich klappt es!'];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function happyFace() {
    let tier;
    if (streak >= 10) tier = 4;
    else if (streak >= 5) tier = 3;
    else if (streak >= 3) tier = 2;
    else if (streak >= 2) tier = 1;
    else tier = 0;
    return pick(HAPPY_TIERS[tier]);
  }

  function sadFace() {
    return SAD_FACES[Math.min(failStreak - 1, SAD_FACES.length - 1)];
  }

  // Zeigt den großen Smiley mittig an (Pop-Animation, verschwindet von selbst)
  function showEmoji(emoji, text, ok) {
    const old = document.getElementById('gamify-overlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'gamify-overlay';
    overlay.className = ok ? 'gamify-ok' : 'gamify-fail';
    overlay.innerHTML =
      '<div class="gamify-emoji">' + emoji + '</div>' +
      '<div class="gamify-text">' + text + '</div>';
    document.body.appendChild(overlay);

    setTimeout(() => overlay.remove(), ok ? 1100 : 1600);
  }

  // Emoji-Konfetti bei Serien-Meilensteinen
  function emojiBurst() {
    const emojis = ['🎉', '⭐', '🔥', '✨', '🎊'];
    for (let i = 0; i < 14; i++) {
      const span = document.createElement('span');
      span.className = 'gamify-confetti';
      span.textContent = pick(emojis);
      span.style.left = (5 + Math.random() * 90) + 'vw';
      span.style.animationDelay = (Math.random() * 0.4) + 's';
      span.style.fontSize = (1.2 + Math.random() * 1.3) + 'rem';
      document.body.appendChild(span);
      setTimeout(() => span.remove(), 2200);
    }
  }

  // ==================== STREAK / SERIE ====================

  function bestKey() {
    const user = (typeof AUTH !== 'undefined' && AUTH.currentUser()) || 'gast';
    return BEST_KEY_PREFIX + user;
  }

  function bestStreak() {
    return parseInt(localStorage.getItem(bestKey()), 10) || 0;
  }

  function saveBestStreak() {
    if (streak > bestStreak()) {
      localStorage.setItem(bestKey(), String(streak));
    }
  }

  function resetStreak() {
    streak = 0;
    failStreak = 0;
  }

  // Kleine Streak-Anzeige für die Statistikzeile
  function streakHtml() {
    let html = '';
    if (streak >= 2) {
      html += ' · <span class="streak-badge">🔥 Serie: ' + streak + '</span>';
    }
    const best = bestStreak();
    if (best >= 3) {
      html += ' · <span class="streak-best">🏆 Rekord: ' + best + '</span>';
    }
    return html;
  }

  // ==================== HAUPTFUNKTION ====================

  /**
   * Reaktion auf eine Antwort: Smiley + Sound + ggf. Konfetti.
   * @param {boolean} ok - war die Antwort richtig?
   */
  function feedback(ok) {
    if (ok) {
      streak++;
      failStreak = 0;
      saveBestStreak();
      const milestone = streak >= 5 && streak % 5 === 0;
      if (milestone) {
        showEmoji(happyFace(), streak + 'er-Serie! 🔥', true);
        emojiBurst();
        playMilestoneSound();
      } else {
        showEmoji(happyFace(), pick(HAPPY_TEXTS), true);
        playCorrectSound();
      }
      vibrate(40);
    } else {
      failStreak++;
      streak = 0;
      showEmoji(sadFace(), pick(SAD_TEXTS), false);
      playWrongSound();
      vibrate([120, 60, 120]);
    }
  }

  // ==================== SOUND-SCHALTER ====================

  function initSoundToggle() {
    const btn = document.getElementById('sound-toggle');
    if (!btn) return;
    function render() {
      btn.textContent = soundOn() ? '🔊' : '🔇';
      btn.title = soundOn() ? 'Töne ausschalten' : 'Töne einschalten';
      btn.classList.toggle('muted', !soundOn());
    }
    btn.addEventListener('click', () => {
      setSoundOn(!soundOn());
      render();
      if (soundOn()) playCorrectSound(); // kurzes Feedback beim Einschalten
    });
    render();
  }

  document.addEventListener('DOMContentLoaded', initSoundToggle);
  if (document.readyState !== 'loading') initSoundToggle();

  return { feedback, resetStreak, streakHtml };
})();
