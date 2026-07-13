/**
 * Thai Language Learning App
 * Main application logic: search, translate, audio playback
 */

(function () {
  'use strict';

  // DOM elements
  const inputField = document.getElementById('input-text');
  const translateBtn = document.getElementById('translate-btn');
  const clearBtn = document.getElementById('clear-btn');
  const resultsContainer = document.getElementById('results');
  const categoryFilter = document.getElementById('category-filter');
  const browseContainer = document.getElementById('browse-list');
  const searchInfo = document.getElementById('search-info');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // Audio state
  let currentUtterance = null;
  let speechSupported = 'speechSynthesis' in window;

  // ==================== LOGIN / AUTH ====================

  const loginOverlay = document.getElementById('login-overlay');
  const userChip = document.getElementById('user-chip');

  function showLoginView(id) {
    document.querySelectorAll('.login-view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.login-error').forEach(e => { e.textContent = ''; e.classList.remove('login-success'); });
  }

  function enterApp() {
    loginOverlay.style.display = 'none';
    userChip.textContent = AUTH.currentUser();
    renderBrowseList(categoryFilter.value || 'all');
    renderMyWords();
  }

  document.getElementById('login-btn').addEventListener('click', async () => {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    const errEl = document.getElementById('login-error');
    try {
      const res = await AUTH.login(user, pass);
      if (res.ok) {
        enterApp();
      } else {
        errEl.textContent = res.error;
      }
    } catch (e) {
      errEl.textContent = 'Technischer Fehler: ' + e.message;
    }
  });

  document.getElementById('login-pass').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('login-btn').click();
  });

  document.getElementById('register-btn').addEventListener('click', async () => {
    const user = document.getElementById('reg-user').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;
    const errEl = document.getElementById('register-error');
    if (pass !== pass2) {
      errEl.textContent = 'Passwörter stimmen nicht überein.';
      return;
    }
    const res = await AUTH.register(user, pass);
    if (res.ok) {
      errEl.classList.add('login-success');
      errEl.textContent = 'Benutzer angelegt! Bitte anmelden.';
      setTimeout(() => {
        showLoginView('view-login');
        document.getElementById('login-user').value = user;
      }, 1200);
    } else {
      errEl.textContent = res.error;
    }
  });

  document.getElementById('reset-btn').addEventListener('click', async () => {
    const user = document.getElementById('reset-user').value.trim();
    const master = document.getElementById('reset-master').value;
    const newPass = document.getElementById('reset-new').value;
    const errEl = document.getElementById('reset-error');
    const res = await AUTH.resetPassword(user, master, newPass);
    if (res.ok) {
      errEl.classList.add('login-success');
      errEl.textContent = 'Passwort zurückgesetzt! Bitte anmelden.';
      setTimeout(() => {
        showLoginView('view-login');
        document.getElementById('login-user').value = user;
      }, 1200);
    } else {
      errEl.textContent = res.error;
    }
  });

  document.getElementById('show-register').addEventListener('click', () => showLoginView('view-register'));
  document.getElementById('show-reset').addEventListener('click', () => showLoginView('view-reset'));
  document.getElementById('back-to-login-1').addEventListener('click', () => showLoginView('view-login'));
  document.getElementById('back-to-login-2').addEventListener('click', () => showLoginView('view-login'));

  document.getElementById('logout-btn').addEventListener('click', () => {
    AUTH.logout();
    GAMIFY.resetStreak();
    document.getElementById('login-pass').value = '';
    loginOverlay.style.display = 'flex';
    showLoginView('view-login');
  });

  // ==================== TABS ====================
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
      if (target === 'learn-tab') learnRefresh();
    });
  });

  // ==================== TRANSLATION SEARCH ====================

  function normalizeInput(text) {
    return text.toLowerCase()
      .replace(/[?.!,;:'"]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function allPhrases() {
    const user = AUTH.currentUser();
    const userWords = user ? AUTH.getUserWords(user).map(w => ({ ...w, custom: true })) : [];
    // User's own words first so they win on equal matches
    return userWords.concat(DICTIONARY.phrases);
  }

  function searchPhrases(query) {
    const normalized = normalizeInput(query);
    const results = [];
    const phrases = allPhrases();

    // 1. Exact match on de or en
    for (const phrase of phrases) {
      const de = normalizeInput(phrase.de);
      const en = normalizeInput(phrase.en);
      if (de === normalized || en === normalized) {
        results.push({ ...phrase, matchType: 'exact' });
      }
    }

    if (results.length > 0) return results;

    // 2. Phrase contains query or query contains phrase
    for (const phrase of phrases) {
      const de = normalizeInput(phrase.de);
      const en = normalizeInput(phrase.en);
      if (de.includes(normalized) || en.includes(normalized) ||
          normalized.includes(de) || normalized.includes(en)) {
        results.push({ ...phrase, matchType: 'partial' });
      }
    }

    if (results.length > 0) return results;

    // 3. Word-by-word lookup
    const words = normalized.split(' ');
    const wordResults = [];
    let allFound = true;
    for (const word of words) {
      if (DICTIONARY.words[word]) {
        wordResults.push(DICTIONARY.words[word]);
      } else {
        allFound = false;
        wordResults.push(null);
      }
    }

    if (wordResults.some(w => w !== null)) {
      const thParts = [];
      const phoneticParts = [];
      const deParts = [];
      const inputWords = normalized.split(' ');

      for (let i = 0; i < wordResults.length; i++) {
        if (wordResults[i]) {
          thParts.push(wordResults[i].th);
          phoneticParts.push(wordResults[i].phonetic);
          deParts.push(wordResults[i].de);
        } else {
          thParts.push('[' + inputWords[i] + ']');
          phoneticParts.push('[' + inputWords[i] + ']');
          deParts.push('[' + inputWords[i] + ']');
        }
      }

      results.push({
        de: query,
        en: query,
        th: thParts.join(' '),
        phonetic: phoneticParts.join(' '),
        wordByWord: deParts.join(' '),
        matchType: allFound ? 'word-by-word' : 'word-by-word-partial'
      });
    }

    return results;
  }

  let lastAiResult = null;
  let lastRenderedResults = [];

  async function translate() {
    const query = inputField.value.trim();
    if (!query) {
      showMessage('Bitte geben Sie einen Satz oder ein Wort ein.');
      return;
    }

    const results = searchPhrases(query);
    const bestMatch = results.length > 0 ? results[0].matchType : null;

    // Nur exakte Wörterbuch-Treffer kommen ohne KI aus (offline, sofort, geprüfte Qualität).
    // Ähnliche Treffer decken oft nur einen Teil des Satzes ab - dann soll die KI
    // den ganzen Satz übersetzen und der Wörterbuch-Treffer erscheint zusätzlich darunter.
    if (bestMatch === 'exact') {
      renderResults(results);
      return;
    }

    // Kein oder nur lückenhafter Treffer: KI fragen, falls Schlüssel hinterlegt
    if (AI_TRANSLATE.hasKey()) {
      showMessage('<span class="ai-loading">🤖 ' + AI_TRANSLATE.providerName() + ' übersetzt ...</span>');
      try {
        const ai = await AI_TRANSLATE.translate(query);
        // Antwort verwerfen, wenn der Nutzer inzwischen etwas anderes eingegeben hat
        if (inputField.value.trim() !== query) return;
        lastAiResult = ai;
        renderResults([{ ...ai, matchType: 'ai' }].concat(results));
        return;
      } catch (e) {
        if (inputField.value.trim() !== query) return;
        if (results.length > 0) {
          renderResults(results);
          resultsContainer.insertAdjacentHTML('afterbegin',
            '<div class="ai-error">⚠️ KI-Übersetzung fehlgeschlagen: ' + escapeHtml(e.message) +
            '<br><small>Es wird das Offline-Wörterbuch angezeigt.</small></div>');
        } else {
          showMessage('⚠️ KI-Übersetzung fehlgeschlagen: ' + escapeHtml(e.message));
        }
        return;
      }
    }

    if (results.length === 0) {
      showMessage(
        'Keine Übersetzung gefunden für: "' + query + '"<br>' +
        '<small>Versuchen Sie ein anderes Wort oder schauen Sie in der Wortliste.<br>' +
        '💡 Tipp: Richten Sie unten die KI-Übersetzung ein, um beliebige Sätze zu übersetzen.</small>'
      );
      return;
    }

    renderResults(results);
    // Unvollständiges Ergebnis ohne KI-Schlüssel: auf die KI-Option hinweisen
    resultsContainer.insertAdjacentHTML('beforeend',
      '<div class="no-result" style="padding:0.5rem 1rem"><small>💡 Tipp: Mit der KI-Übersetzung (unten einrichten) ' +
      'wird Ihr ganzer Satz übersetzt.</small></div>');
  }

  function showMessage(html) {
    resultsContainer.innerHTML =
      '<div class="no-result">' + html + '</div>';
  }

  function renderResults(results) {
    lastRenderedResults = results;
    let html = '';
    results.forEach((r, idx) => {
      let matchLabel = r.matchType === 'ai' ? '🤖 KI-Übersetzung (' + AI_TRANSLATE.providerName() + ')' :
        r.matchType === 'exact' ? 'Exakter Treffer' :
        r.matchType === 'partial' ? 'Ähnlicher Treffer' :
        r.matchType === 'word-by-word' ? 'Wort-für-Wort' :
        'Teilweise Wort-für-Wort';
      if (r.custom) matchLabel += ' · Eigenes Wort';

      html += `
        <div class="result-card">
          <div class="match-badge ${r.matchType}">${matchLabel}</div>
          <div class="result-row">
            <span class="result-label">Eingabe (DE):</span>
            <span class="result-value">${escapeHtml(r.de)}</span>
          </div>
          <div class="result-row">
            <span class="result-label">Input (EN):</span>
            <span class="result-value">${escapeHtml(r.en)}</span>
          </div>
          <div class="result-row thai-row">
            <span class="result-label">Thai:</span>
            <span class="result-value thai-text">${escapeHtml(r.th)}</span>
            <button class="audio-btn" onclick="playAudio('${escapeAttr(r.th)}')" title="Thai anhören" aria-label="Thai Audio abspielen">
              <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            </button>
          </div>
          <div class="result-row">
            <span class="result-label">Phonetik:</span>
            <span class="result-value phonetic-text">${escapeHtml(r.phonetic)}</span>
            <button class="audio-btn small" onclick="playAudioPhonetic('${escapeAttr(r.phonetic)}')" title="Phonetik vorlesen" aria-label="Phonetik Audio abspielen">
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            </button>
          </div>
          <div class="result-row">
            <span class="result-label">Wort-für-Wort (DE):</span>
            <span class="result-value word-by-word">${escapeHtml(r.wordByWord)}</span>
          </div>
          ${scheduleRowHtml(r, 'result', idx)}
          ${r.matchType === 'ai' ? `
          <button class="btn btn-secondary save-ai-btn" onclick="saveAiWord(this)">💾 Zu meinen Wörtern</button>` : ''}
        </div>
      `;
    });
    resultsContainer.innerHTML = html;
  }

  // KI-Ergebnis in "Meine Wörter" übernehmen (fließt dann auch ins Lernsystem ein)
  window.saveAiWord = function (btn) {
    const user = AUTH.currentUser();
    if (!user || !lastAiResult) return;
    // Nicht doppelt anlegen, falls die Wiedervorlage-Auswahl schon gespeichert hat
    if (!entryExistsInLearnPool(lastAiResult)) AUTH.addUserWord(user, lastAiResult);
    renderMyWords();
    btn.textContent = '✓ Gespeichert';
    btn.disabled = true;
  };

  // ==================== AUDIO ====================

  window.playAudio = function (thaiText) {
    if (!speechSupported) {
      alert('Sprachsynthese wird auf diesem Gerät nicht unterstützt.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Remove spaces that we added for display (Thai doesn't use spaces natively)
    const cleanText = thaiText.replace(/\s+/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'th-TH';
    utterance.rate = 0.8; // Slower for learning

    // Try to find a Thai voice
    const voices = window.speechSynthesis.getVoices();
    const thaiVoice = voices.find(v => v.lang.startsWith('th'));
    if (thaiVoice) {
      utterance.voice = thaiVoice;
    }

    // Visual feedback
    const btns = document.querySelectorAll('.audio-btn');
    utterance.onstart = () => {
      btns.forEach(b => b.classList.add('playing'));
    };
    utterance.onend = () => {
      btns.forEach(b => b.classList.remove('playing'));
    };
    utterance.onerror = () => {
      btns.forEach(b => b.classList.remove('playing'));
    };

    window.speechSynthesis.speak(utterance);
    currentUtterance = utterance;
  };

  window.playAudioPhonetic = function (phoneticText) {
    if (!speechSupported) {
      alert('Sprachsynthese wird auf diesem Gerät nicht unterstützt.');
      return;
    }
    window.speechSynthesis.cancel();

    // Read phonetic text as guide (use English voice for approximate pronunciation)
    const utterance = new SpeechSynthesisUtterance(phoneticText);
    utterance.lang = 'en-US';
    utterance.rate = 0.6;
    window.speechSynthesis.speak(utterance);
  };

  // Ensure voices are loaded (needed on some Android browsers)
  if (speechSupported) {
    window.speechSynthesis.onvoiceschanged = function () {
      // Voices loaded
    };
    // Trigger voice loading
    window.speechSynthesis.getVoices();
  }

  // ==================== PRIORITÄTS-LERNLISTE ====================

  function isPriority(p) {
    const user = AUTH.currentUser();
    return user ? AUTH.getUserPriorities(user).includes(learnKey(p)) : false;
  }

  // Attributwert-sicheres Escaping (auch Anführungszeichen)
  function escapeAttrValue(text) {
    return escapeHtml(text).replace(/"/g, '&quot;');
  }

  function priorityBtnHtml(p) {
    const active = isPriority(p);
    return '<button class="priority-btn' + (active ? ' active' : '') + '" ' +
      'data-key="' + escapeAttrValue(learnKey(p)) + '" ' +
      'onclick="event.stopPropagation(); togglePriority(this)">' +
      (active ? '⭐ Auf der Lernliste' : '☆ Mit Priorität lernen') + '</button>';
  }

  window.togglePriority = function (btn) {
    const user = AUTH.currentUser();
    if (!user) return;
    const nowActive = AUTH.toggleUserPriority(user, btn.dataset.key);
    btn.classList.toggle('active', nowActive);
    btn.textContent = nowActive ? '⭐ Auf der Lernliste' : '☆ Mit Priorität lernen';
  };

  // ==================== WIEDERVORLAGE (WANN WIEDER LERNEN) ====================
  // Der Nutzer legt pro Karte fest, wann sie wieder drankommen soll -
  // direkt bei einer frisch erzeugten Übersetzung und auf jeder Lernkarte.

  const SCHEDULE_OPTIONS = [
    { id: 'now', label: 'Sofort', ms: 0 },
    { id: 'm5', label: '5 Min', ms: 5 * 60 * 1000 },
    { id: 'd1', label: '1 Tag', ms: 24 * 60 * 60 * 1000 },
    { id: 'w1', label: '1 Woche', ms: 7 * 24 * 60 * 60 * 1000 },
    { id: 'never', label: 'Gar nicht', ms: null }
  ];

  function loadSchedule() {
    const user = AUTH.currentUser();
    return user ? AUTH.getUserSchedule(user) : {};
  }

  function scheduleStatusText(optId) {
    switch (optId) {
      case 'now': return '⏰ Wiederholung: sofort';
      case 'm5': return '⏰ Wiederholung: in 5 Minuten';
      case 'd1': return '⏰ Wiederholung: in 1 Tag';
      case 'w1': return '⏰ Wiederholung: in 1 Woche';
      case 'never': return '🚫 Kommt nicht mehr im Lernsystem dran';
      default: return '';
    }
  }

  // 'normal' = kein Termin, 'due' = fällig, 'later' = für später geplant, 'never' = ausgeschlossen
  function cardAvailability(p, schedule, now) {
    const s = schedule[learnKey(p)];
    if (!s) return 'normal';
    if (s.opt === 'never') return 'never';
    if (typeof s.due === 'number' && s.due > now) return 'later';
    return 'due';
  }

  // origin 'result': Übersetzungskarte (index in lastRenderedResults), origin 'card': aktuelle Lernkarte
  function scheduleRowHtml(p, origin, index) {
    const sched = loadSchedule()[learnKey(p)];
    const activeOpt = sched ? sched.opt : null;
    let html = '<div class="schedule-box"><div class="schedule-label">⏰ Wieder lernen:</div><div class="schedule-row">';
    for (const o of SCHEDULE_OPTIONS) {
      html += '<button class="schedule-btn' + (activeOpt === o.id ? ' active' : '') + (o.id === 'never' ? ' never' : '') + '" ' +
        'onclick="event.stopPropagation(); setCardSchedule(this, \'' + origin + '\', ' + index + ', \'' + o.id + '\')">' +
        o.label + '</button>';
    }
    html += '</div><div class="schedule-status">' + (activeOpt ? escapeHtml(scheduleStatusText(activeOpt)) : '') + '</div></div>';
    return html;
  }

  function entryExistsInLearnPool(card) {
    const key = learnKey(card);
    const user = AUTH.currentUser();
    const userWords = user ? AUTH.getUserWords(user) : [];
    return DICTIONARY.phrases.concat(userWords).some(p => learnKey(p) === key);
  }

  window.setCardSchedule = function (btn, origin, index, optId) {
    const user = AUTH.currentUser();
    if (!user) return;
    const card = origin === 'result' ? lastRenderedResults[index] :
      origin === 'due' ? dueListCards[index] : currentCard;
    if (!card) return;
    // Frisch erzeugte Übersetzungen (KI / Wort-für-Wort) gibt es weder im Wörterbuch
    // noch in "Meine Wörter" - erst dort speichern, sonst kann die Karte nie drankommen.
    let autoSaved = false;
    if (optId !== 'never' && !entryExistsInLearnPool(card)) {
      AUTH.addUserWord(user, {
        de: card.de,
        en: card.en || card.de,
        th: card.th,
        phonetic: card.phonetic || '-',
        wordByWord: card.wordByWord || card.de
      });
      renderMyWords();
      autoSaved = true;
    }
    const opt = SCHEDULE_OPTIONS.find(o => o.id === optId);
    const entry = optId === 'never' ? { opt: 'never', due: null } : { opt: optId, due: Date.now() + opt.ms };
    AUTH.setUserScheduleEntry(user, learnKey(card), entry);

    const box = btn.closest('.schedule-box');
    box.querySelectorAll('.schedule-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    box.querySelector('.schedule-status').textContent =
      scheduleStatusText(optId) + (autoSaved ? ' · zu "Meine Wörter" gespeichert' : '');
    // In der Fällig-Übersicht: Bestätigung kurz zeigen, dann Liste aktualisieren
    if (origin === 'due') setTimeout(renderDueOverview, 700);
  };

  // ==================== LAUTSCHRIFT EIN-/AUSBLENDEN ====================
  // Globale Einstellung: blendet alle Zeilen mit der Klasse "phonetic-row" aus
  // (Wortliste in allen Kategorien, Suche, Fällige-Karten-Übersicht).

  const PHONETIC_KEY = 'thaiapp_show_phonetic';

  function phoneticVisible() {
    return localStorage.getItem(PHONETIC_KEY) !== '0';
  }

  function phoneticToggleLabel() {
    return phoneticVisible() ? '🔤 Lautschrift ausblenden' : '🔤 Lautschrift einblenden';
  }

  function phoneticToggleBtnHtml() {
    return '<button class="phonetic-toggle" onclick="togglePhonetic()">' + phoneticToggleLabel() + '</button>';
  }

  function applyPhoneticSetting() {
    document.body.classList.toggle('hide-phonetic', !phoneticVisible());
    document.querySelectorAll('.phonetic-toggle').forEach(b => { b.textContent = phoneticToggleLabel(); });
  }

  window.togglePhonetic = function () {
    localStorage.setItem(PHONETIC_KEY, phoneticVisible() ? '0' : '1');
    applyPhoneticSetting();
  };

  // ==================== BROWSE / WORTLISTE ====================

  function getCategories() {
    const cats = new Map();
    for (const phrase of DICTIONARY.phrases) {
      // Derive category from position in array
      let cat = 'Allgemein';
      const de = phrase.de.toLowerCase();
      if (['hallo', 'guten morgen', 'guten abend', 'gute nacht', 'wie geht es ihnen', 'mir geht es gut', 'auf wiedersehen', 'tschüss', 'bis später'].includes(de)) cat = 'Begrüßungen';
      else if (['danke', 'vielen dank', 'bitte', 'entschuldigung', 'es tut mir leid', 'kein problem', 'bitte schön', 'gern geschehen'].includes(de)) cat = 'Höflichkeit';
      else if (['ich heiße', 'wie heißen sie', 'freut mich', 'ich komme aus deutschland', 'ich bin deutscher', 'ich lerne thai'].includes(de)) cat = 'Vorstellung';
      else if (['eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'hundert', 'tausend'].includes(de)) cat = 'Zahlen';
      else if (['ich habe hunger', 'ich habe durst', 'ich möchte essen', 'ich möchte trinken', 'wasser', 'reis', 'gebratener reis', 'nudeln', 'suppe', 'huhn', 'schweinefleisch', 'rindfleisch', 'fisch', 'garnele', 'gemüse', 'obst', 'bier', 'kaffee', 'tee', 'lecker', 'scharf', 'nicht scharf', 'die rechnung bitte'].includes(de)) cat = 'Essen & Trinken';
      else if (['wo ist', 'links', 'rechts', 'geradeaus', 'toilette', 'hotel', 'flughafen', 'bahnhof', 'krankenhaus', 'markt', 'strand', 'tempel'].includes(de)) cat = 'Richtungen & Orte';
      else if (['wie viel kostet das', 'zu teuer', 'können sie billiger machen', 'ich möchte das kaufen', 'groß', 'klein'].includes(de)) cat = 'Einkaufen';
      else if (['taxi', 'bus', 'zug', 'ich möchte nach bangkok fahren', 'bitte halten sie hier'].includes(de)) cat = 'Verkehr';
      else if (['heute', 'morgen', 'gestern', 'jetzt', 'wie spät ist es'].includes(de)) cat = 'Zeit';
      else if (['es ist heiß', 'es regnet', 'es ist kalt'].includes(de)) cat = 'Wetter';
      else if (['hilfe', 'ich brauche einen arzt', 'rufen sie die polizei', 'ich bin krank', 'ich habe mich verlaufen'].includes(de)) cat = 'Notfälle';
      else if (['ich bin glücklich', 'ich bin traurig', 'ich bin müde', 'ich liebe dich', 'ich vermisse dich'].includes(de)) cat = 'Gefühle';
      else if (['pad thai', 'tom yum suppe', 'grünes curry', 'rotes curry', 'papaya salat', 'mango mit klebreis'].includes(de)) cat = 'Thai Gerichte';
      else if (['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'].includes(de)) cat = 'Wochentage';
      else if (['rot', 'blau', 'grün', 'gelb', 'weiß', 'schwarz'].includes(de)) cat = 'Farben';
      else if (['kopf', 'auge', 'mund', 'hand', 'fuß'].includes(de)) cat = 'Körper';
      else if (['mutter', 'vater', 'bruder', 'schwester', 'kind', 'freund'].includes(de)) cat = 'Familie';
      else if (['was', 'wer', 'wann', 'warum', 'wie', 'was ist das'].includes(de)) cat = 'Fragen';
      else if (['ja', 'nein', 'vielleicht', 'richtig'].includes(de)) cat = 'Ja / Nein';
      else if (de.includes('versteh') || de.includes('sprech') || de.includes('sprache')) cat = 'Sprache';
      else if (['ich möchte ein zimmer', 'wie viel kostet eine nacht', 'haben sie freie zimmer'].includes(de)) cat = 'Unterkunft';
      else cat = 'Nützliche Sätze';

      if (!cats.has(cat)) cats.set(cat, []);
      cats.get(cat).push(phrase);
    }
    return cats;
  }

  function renderBrowseList(filterCat) {
    const cats = getCategories();
    let html = '';
    let count = 0;

    for (const [cat, phrases] of cats) {
      if (filterCat && filterCat !== 'all' && cat !== filterCat) continue;

      html += `<div class="category-section"><h3>${escapeHtml(cat)}</h3>`;
      for (const p of phrases) {
        count++;
        html += `
          <div class="browse-item" onclick="browseTap(this)">
            <div class="browse-de">${escapeHtml(p.de)}</div>
            <div class="browse-details" style="display:none">
              <div class="result-row">
                <span class="result-label">EN:</span>
                <span class="result-value">${escapeHtml(p.en)}</span>
              </div>
              <div class="result-row thai-row">
                <span class="result-label">Thai:</span>
                <span class="result-value thai-text">${escapeHtml(p.th)}</span>
                <button class="audio-btn" onclick="event.stopPropagation(); playAudio('${escapeAttr(p.th)}')" title="Anhören">
                  <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                </button>
              </div>
              <div class="result-row phonetic-row">
                <span class="result-label">Phonetik:</span>
                <span class="result-value phonetic-text">${escapeHtml(p.phonetic)}</span>
              </div>
              <div class="result-row">
                <span class="result-label">Wort-für-Wort:</span>
                <span class="result-value word-by-word">${escapeHtml(p.wordByWord)}</span>
              </div>
              ${priorityBtnHtml(p)}
            </div>
          </div>
        `;
      }
      html += '</div>';
    }

    browseContainer.innerHTML = html;
    searchInfo.textContent = count + ' Einträge';

    // Populate category filter
    if (categoryFilter.options.length <= 1) {
      for (const cat of cats.keys()) {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categoryFilter.appendChild(opt);
      }
    }
  }

  // ==================== SUBSTRING SEARCH (all entries) ====================

  const browseSearchInput = document.getElementById('browse-search');

  // Fold diacritics so "suai" also matches "sǔai"
  function fold(text) {
    return (text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function runBrowseSearch() {
    const query = fold(browseSearchInput.value.trim());
    if (!query) {
      renderBrowseList(categoryFilter.value || 'all');
      return;
    }

    const matches = allPhrases().filter(p =>
      [p.de, p.en, p.th, p.phonetic, p.wordByWord].some(f => fold(f).includes(query))
    );

    searchInfo.textContent = matches.length + ' Treffer';

    if (matches.length === 0) {
      browseContainer.innerHTML = '<div class="no-result">Keine Einträge gefunden für "' + escapeHtml(browseSearchInput.value.trim()) + '".</div>';
      return;
    }

    let html = '';
    for (const p of matches) {
      html += `
        <div class="result-card">
          ${p.custom ? '<div class="match-badge word-by-word">Eigenes Wort</div>' : ''}
          <div class="result-row">
            <span class="result-label">Deutsch:</span>
            <span class="result-value">${escapeHtml(p.de)}</span>
          </div>
          <div class="result-row">
            <span class="result-label">Englisch:</span>
            <span class="result-value">${escapeHtml(p.en)}</span>
          </div>
          <div class="result-row thai-row">
            <span class="result-label">Thai:</span>
            <span class="result-value thai-text">${escapeHtml(p.th)}</span>
            <button class="audio-btn" onclick="playAudio('${escapeAttr(p.th)}')" title="Anhören" aria-label="Thai Audio abspielen">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            </button>
          </div>
          <div class="result-row phonetic-row">
            <span class="result-label">Phonetik:</span>
            <span class="result-value phonetic-text">${escapeHtml(p.phonetic)}</span>
          </div>
          <div class="result-row">
            <span class="result-label">Wort-für-Wort:</span>
            <span class="result-value word-by-word">${escapeHtml(p.wordByWord)}</span>
          </div>
          ${priorityBtnHtml(p)}
        </div>
      `;
    }
    browseContainer.innerHTML = html;
  }

  document.getElementById('browse-search-btn').addEventListener('click', runBrowseSearch);

  browseSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runBrowseSearch();
    }
  });

  // Restore category list when the search field is cleared
  browseSearchInput.addEventListener('input', () => {
    if (browseSearchInput.value.trim() === '') {
      renderBrowseList(categoryFilter.value || 'all');
    }
  });

  window.browseTap = function (el) {
    const details = el.querySelector('.browse-details');
    if (details) {
      details.style.display = details.style.display === 'none' ? 'block' : 'none';
      el.classList.toggle('expanded');
    }
  };

  categoryFilter.addEventListener('change', () => {
    renderBrowseList(categoryFilter.value);
  });

  // ==================== EVENT LISTENERS ====================

  translateBtn.addEventListener('click', translate);

  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      translate();
    }
  });

  clearBtn.addEventListener('click', () => {
    inputField.value = '';
    resultsContainer.innerHTML = '<div class="no-result">Geben Sie einen deutschen oder englischen Satz ein und drücken Sie "Übersetzen".</div>';
    inputField.focus();
  });

  // Quick example buttons
  document.querySelectorAll('.example-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      inputField.value = btn.dataset.text;
      translate();
      // Switch to translate tab
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      document.querySelector('[data-tab="translate-tab"]').classList.add('active');
      document.getElementById('translate-tab').classList.add('active');
    });
  });

  // ==================== MY WORDS / EIGENE WÖRTER ====================

  const myWordsList = document.getElementById('mywords-list');

  function renderMyWords() {
    const user = AUTH.currentUser();
    if (!user) return;
    const words = AUTH.getUserWords(user);

    if (words.length === 0) {
      myWordsList.innerHTML = '<div class="no-result">Noch keine eigenen Wörter.<br><small>Fügen Sie oben Ihren ersten Eintrag hinzu.</small></div>';
      return;
    }

    let html = '';
    words.forEach((w, i) => {
      html += `
        <div class="result-card myword-item">
          <button class="delete-word-btn" onclick="deleteMyWord(${i})" title="Löschen" aria-label="Eintrag löschen">&times;</button>
          <div class="result-row">
            <span class="result-label">Deutsch:</span>
            <span class="result-value">${escapeHtml(w.de)}</span>
          </div>
          ${w.en && w.en !== w.de ? `
          <div class="result-row">
            <span class="result-label">Englisch:</span>
            <span class="result-value">${escapeHtml(w.en)}</span>
          </div>` : ''}
          <div class="result-row thai-row">
            <span class="result-label">Thai:</span>
            <span class="result-value thai-text">${escapeHtml(w.th)}</span>
            <button class="audio-btn" onclick="playAudio('${escapeAttr(w.th)}')" title="Anhören" aria-label="Thai Audio abspielen">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            </button>
          </div>
          <div class="result-row">
            <span class="result-label">Phonetik:</span>
            <span class="result-value phonetic-text">${escapeHtml(w.phonetic)}</span>
          </div>
          <div class="result-row">
            <span class="result-label">Wort-für-Wort:</span>
            <span class="result-value word-by-word">${escapeHtml(w.wordByWord)}</span>
          </div>
        </div>
      `;
    });
    myWordsList.innerHTML = html;
  }

  window.deleteMyWord = function (index) {
    const user = AUTH.currentUser();
    if (!user) return;
    AUTH.deleteUserWord(user, index);
    renderMyWords();
  };

  document.getElementById('add-word-btn').addEventListener('click', () => {
    const user = AUTH.currentUser();
    if (!user) return;
    const de = document.getElementById('mw-de').value.trim();
    const en = document.getElementById('mw-en').value.trim();
    const th = document.getElementById('mw-th').value.trim();
    const ph = document.getElementById('mw-ph').value.trim();
    const ww = document.getElementById('mw-ww').value.trim();
    const errEl = document.getElementById('mw-error');

    if (!de || !th) {
      errEl.textContent = 'Deutsch und Thai sind Pflichtfelder.';
      return;
    }
    errEl.textContent = '';

    AUTH.addUserWord(user, {
      de: de,
      en: en || de,
      th: th,
      phonetic: ph || '-',
      wordByWord: ww || de
    });

    ['mw-de', 'mw-en', 'mw-th', 'mw-ph', 'mw-ww'].forEach(id => {
      document.getElementById(id).value = '';
    });
    renderMyWords();
  });

  // ==================== LEARN / LERNSYSTEM ====================

  const learnArea = document.getElementById('learn-area');
  const learnStats = document.getElementById('learn-stats');
  const learnSource = document.getElementById('learn-source');

  let learnMode = 'cards';
  let learnPool = [];
  let currentCard = null;
  let lastCardKey = null;
  let quizScore = { right: 0, total: 0 };
  // "Trotzdem üben": Wiedervorlage-Wartezeiten für diese Lernrunde ignorieren
  let ignoreSchedule = false;
  // Zeitpunkt, zu dem die aktuelle Karte angezeigt wurde (für die Wiedervorlage)
  let currentCardShownAt = 0;
  // Karten in der Fällig-Übersicht (Index-Zuordnung für die Wiedervorlage-Buttons)
  let dueListCards = [];

  function learnKey(p) {
    return p.de + '|' + p.th;
  }

  function loadProgress() {
    const user = AUTH.currentUser();
    return user ? AUTH.getUserProgress(user) : {};
  }

  function saveProgress(progress) {
    const user = AUTH.currentUser();
    if (user) AUTH.saveUserProgress(user, progress);
  }

  function recordResult(card, ok) {
    const progress = loadProgress();
    const key = learnKey(card);
    if (!progress[key]) progress[key] = { ok: 0, fail: 0 };
    if (ok) progress[key].ok++; else progress[key].fail++;
    saveProgress(progress);
    // Eine fällige Wiedervorlage ist mit dieser Antwort erledigt. Nur Termine
    // löschen, die schon beim Anzeigen der Karte fällig waren - eine gerade
    // erst auf der Karte gewählte Zeit (z.B. "Sofort") soll bestehen bleiben.
    const user = AUTH.currentUser();
    if (user) {
      const s = AUTH.getUserSchedule(user)[key];
      if (s && s.opt !== 'never' && typeof s.due === 'number' && s.due <= currentCardShownAt) {
        AUTH.setUserScheduleEntry(user, key, null);
      }
    }
  }

  function populateLearnSources() {
    const previous = learnSource.value;
    // Keep first option (Alle), rebuild the rest
    while (learnSource.options.length > 1) learnSource.remove(1);
    for (const cat of getCategories().keys()) {
      const opt = document.createElement('option');
      opt.value = 'cat:' + cat;
      opt.textContent = cat;
      learnSource.appendChild(opt);
    }
    const prio = document.createElement('option');
    prio.value = 'priority';
    prio.textContent = '⭐ Meine Lernliste';
    learnSource.appendChild(prio);
    const own = document.createElement('option');
    own.value = 'custom';
    own.textContent = 'Meine Wörter';
    learnSource.appendChild(own);
    // Restore the previous selection if it still exists
    if ([...learnSource.options].some(o => o.value === previous)) {
      learnSource.value = previous;
    }
  }

  function buildLearnPool() {
    const src = learnSource.value;
    const user = AUTH.currentUser();
    const userWords = user ? AUTH.getUserWords(user) : [];
    if (src === 'custom') {
      learnPool = userWords.slice();
    } else if (src === 'priority') {
      const keys = user ? AUTH.getUserPriorities(user) : [];
      learnPool = DICTIONARY.phrases.concat(userWords).filter(p => keys.includes(learnKey(p)));
    } else if (src.startsWith('cat:')) {
      learnPool = (getCategories().get(src.slice(4)) || []).slice();
    } else {
      learnPool = DICTIONARY.phrases.concat(userWords);
    }
  }

  // Difficult words (more failures) get a higher weight and appear more often;
  // words on the priority learn list are boosted strongly on top of that.
  // Die Wiedervorlage filtert zusätzlich: "Gar nicht" fliegt raus, für später
  // geplante Karten warten, fällige Karten werden stark bevorzugt.
  function pickCard() {
    if (learnPool.length === 0) return null;
    const schedule = loadSchedule();
    const now = Date.now();
    let pool = learnPool.filter(p => cardAvailability(p, schedule, now) !== 'never');
    if (!ignoreSchedule) {
      pool = pool.filter(p => cardAvailability(p, schedule, now) !== 'later');
    }
    if (pool.length === 0) return null;
    const progress = loadProgress();
    const user = AUTH.currentUser();
    const prioKeys = new Set(user ? AUTH.getUserPriorities(user) : []);
    const weighted = [];
    for (const p of pool) {
      const key = learnKey(p);
      const st = progress[key] || { ok: 0, fail: 0 };
      let w = Math.max(1, 1 + 3 * st.fail - st.ok);
      if (prioKeys.has(key)) w *= 6;
      if (cardAvailability(p, schedule, now) === 'due') w *= 8;
      weighted.push({ p, w });
    }
    let candidates = weighted;
    if (weighted.length > 1 && lastCardKey) {
      candidates = weighted.filter(x => learnKey(x.p) !== lastCardKey);
    }
    const total = candidates.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    for (const x of candidates) {
      r -= x.w;
      if (r <= 0) { lastCardKey = learnKey(x.p); return x.p; }
    }
    lastCardKey = learnKey(candidates[candidates.length - 1].p);
    return candidates[candidates.length - 1].p;
  }

  function updateLearnStats() {
    const progress = loadProgress();
    const schedule = loadSchedule();
    const now = Date.now();
    let learned = 0, due = 0;
    for (const p of learnPool) {
      const st = progress[learnKey(p)];
      if (st && st.ok - st.fail >= 2) learned++;
      if (cardAvailability(p, schedule, now) === 'due') due++;
    }
    let text = learned + ' von ' + learnPool.length + ' gelernt';
    if (due > 0) text += ' · ⏰ ' + due + ' fällig';
    if (learnMode === 'quiz' && quizScore.total > 0) {
      text += ' · Quiz: ' + quizScore.right + '/' + quizScore.total + ' richtig';
    }
    learnStats.innerHTML = escapeHtml(text) + GAMIFY.streakHtml();
  }

  function learnRefresh() {
    ignoreSchedule = false;
    populateLearnSources();
    buildLearnPool();
    if (learnMode === 'due') {
      updateLearnStats();
      renderDueOverview();
      return;
    }
    if (learnPool.length === 0) {
      learnArea.innerHTML = learnSource.value === 'priority'
        ? '<div class="no-result">Ihre Lernliste ist noch leer.<br><small>Markieren Sie Wörter in der Wortliste mit "☆ Mit Priorität lernen".</small></div>'
        : '<div class="no-result">Keine Einträge in dieser Auswahl.<br><small>Fügen Sie unter "Meine Wörter" eigene Einträge hinzu.</small></div>';
      learnStats.textContent = '';
      return;
    }
    updateLearnStats();
    if (learnMode === 'cards') renderFlashcard(); else renderQuiz();
  }

  // Nächster Wiedervorlage-Termin in der aktuellen Auswahl (oder null)
  function nextDueTime() {
    const schedule = loadSchedule();
    const now = Date.now();
    let next = null;
    for (const p of learnPool) {
      const s = schedule[learnKey(p)];
      if (s && s.opt !== 'never' && typeof s.due === 'number' && s.due > now) {
        if (next === null || s.due < next) next = s.due;
      }
    }
    return next;
  }

  function formatDuration(ms) {
    const min = Math.round(ms / 60000);
    if (min < 1) return 'unter einer Minute';
    if (min < 60) return min + ' Minute' + (min === 1 ? '' : 'n');
    const h = Math.round(min / 60);
    if (h < 24) return h + ' Stunde' + (h === 1 ? '' : 'n');
    const d = Math.round(h / 24);
    return d + ' Tag' + (d === 1 ? '' : 'en');
  }

  // Alle Karten sind für später geplant oder auf "Gar nicht" gestellt
  function renderNoDueCard() {
    const next = nextDueTime();
    learnArea.innerHTML = next === null
      ? '<div class="no-result">Alle Karten dieser Auswahl sind auf "Gar nicht" gestellt.<br>' +
        '<small>Wählen Sie eine andere Auswahl oder ändern Sie die Wiedervorlage der Karten.</small></div>'
      : '<div class="no-result">🎉 Gerade ist nichts fällig!<br>' +
        '<small>Die nächste Karte kommt in ' + escapeHtml(formatDuration(next - Date.now())) + ' wieder dran.</small><br>' +
        '<button class="btn btn-secondary" style="margin-top:0.8rem" onclick="practiceAnyway()">Trotzdem üben</button></div>';
  }

  window.practiceAnyway = function () {
    ignoreSchedule = true;
    if (learnMode === 'cards') renderFlashcard(); else renderQuiz();
  };

  // ---------- Fällige-Karten-Übersicht ----------
  // Zeigt alle gerade fälligen Karten (aus dem ganzen Bestand, unabhängig von
  // der Kategorie-Auswahl), am längsten überfällige zuerst.

  function renderDueOverview() {
    const user = AUTH.currentUser();
    const schedule = loadSchedule();
    const now = Date.now();
    const all = DICTIONARY.phrases.concat(user ? AUTH.getUserWords(user) : []);
    dueListCards = all
      .filter(p => cardAvailability(p, schedule, now) === 'due')
      .sort((a, b) => (schedule[learnKey(a)].due || 0) - (schedule[learnKey(b)].due || 0));

    let html = '<div class="due-header">' +
      '<span class="due-count">⏰ ' + dueListCards.length + ' fällige Karte' + (dueListCards.length === 1 ? '' : 'n') + '</span>' +
      phoneticToggleBtnHtml() +
      '</div>' +
      '<div class="due-hint">Alle fälligen Karten – unabhängig von der Kategorie-Auswahl oben.</div>';

    if (dueListCards.length === 0) {
      html += '<div class="no-result">🎉 Gerade ist keine Karte fällig.<br>' +
        '<small>Planen Sie Karten über "⏰ Wieder lernen" auf Übersetzungs- und Lernkarten ein.</small></div>';
      learnArea.innerHTML = html;
      return;
    }

    dueListCards.forEach((p, idx) => {
      const s = schedule[learnKey(p)];
      const since = typeof s.due === 'number' ? formatDuration(now - s.due) : '';
      html += `
        <div class="result-card due-item">
          ${since ? '<div class="due-since">fällig seit ' + escapeHtml(since) + '</div>' : ''}
          <div class="result-row">
            <span class="result-label">Deutsch:</span>
            <span class="result-value">${escapeHtml(p.de)}</span>
          </div>
          <div class="result-row thai-row">
            <span class="result-label">Thai:</span>
            <span class="result-value thai-text">${escapeHtml(p.th)}</span>
            <button class="audio-btn" onclick="playAudio('${escapeAttr(p.th)}')" title="Anhören" aria-label="Thai Audio abspielen">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            </button>
          </div>
          <div class="result-row phonetic-row">
            <span class="result-label">Phonetik:</span>
            <span class="result-value phonetic-text">${escapeHtml(p.phonetic)}</span>
          </div>
          <div class="result-row">
            <span class="result-label">Wort-für-Wort:</span>
            <span class="result-value word-by-word">${escapeHtml(p.wordByWord)}</span>
          </div>
          ${scheduleRowHtml(p, 'due', idx)}
        </div>
      `;
    });
    learnArea.innerHTML = html;
  }

  // ---------- Flashcards ----------

  function renderFlashcard() {
    currentCard = pickCard();
    if (!currentCard) { renderNoDueCard(); return; }
    currentCardShownAt = Date.now();
    const c = currentCard;
    learnArea.innerHTML = `
      <div class="flashcard" id="fc" onclick="flipCard()">
        ${isPriority(c) ? '<div class="fc-star">⭐ Lernliste</div>' : ''}
        <div class="fc-prompt">${escapeHtml(c.de)}</div>
        ${c.en && c.en !== c.de ? '<div class="fc-en">' + escapeHtml(c.en) + '</div>' : ''}
        <div class="fc-hint">Tippen zum Umdrehen</div>
      </div>
      <div class="fc-actions">
        <button class="btn btn-secondary" onclick="flipCard()">Umdrehen</button>
      </div>
    `;
  }

  window.flipCard = function () {
    const c = currentCard;
    if (!c) return;
    learnArea.innerHTML = `
      <div class="flashcard">
        <div class="fc-thai">${escapeHtml(c.th)}</div>
        <div class="fc-phonetic">${escapeHtml(c.phonetic)}</div>
        <div class="fc-ww">${escapeHtml(c.wordByWord)}</div>
        <div class="fc-en" style="margin-top:0.8rem">${escapeHtml(c.de)}</div>
        <button class="audio-btn" style="margin-top:0.8rem" onclick="event.stopPropagation(); playAudio('${escapeAttr(c.th)}')" aria-label="Thai Audio abspielen">
          <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        </button>
      </div>
      <div class="fc-actions">
        <button class="btn btn-know" onclick="answerCard(true)">✓ Gewusst</button>
        <button class="btn btn-dontknow" onclick="answerCard(false)">✗ Nicht gewusst</button>
      </div>
      ${scheduleRowHtml(c, 'card', 0)}
    `;
  };

  window.answerCard = function (ok) {
    recordResult(currentCard, ok);
    GAMIFY.feedback(ok);
    updateLearnStats();
    renderFlashcard();
  };

  // ---------- Quiz ----------

  function renderQuiz() {
    currentCard = pickCard();
    if (!currentCard) { renderNoDueCard(); return; }
    currentCardShownAt = Date.now();
    const c = currentCard;

    // Distractors: 3 other entries; fall back to the whole dictionary if the pool is small
    let distractorSource = learnPool.filter(p => learnKey(p) !== learnKey(c));
    if (distractorSource.length < 3) {
      const extra = DICTIONARY.phrases.filter(p => learnKey(p) !== learnKey(c));
      distractorSource = distractorSource.concat(extra);
    }
    const distractors = [];
    const used = new Set([c.th]);
    while (distractors.length < 3 && distractorSource.length > 0) {
      const i = Math.floor(Math.random() * distractorSource.length);
      const cand = distractorSource.splice(i, 1)[0];
      if (!used.has(cand.th)) {
        used.add(cand.th);
        distractors.push(cand);
      }
    }

    const options = distractors.concat([c]);
    // Shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    let html = `
      <div class="quiz-score">Punkte: ${quizScore.right}/${quizScore.total}</div>
      <div class="quiz-prompt">
        <div style="font-size:0.8rem;color:var(--text-light)">Was heißt auf Thai:</div>
        <div class="qp-word">${isPriority(c) ? '⭐ ' : ''}${escapeHtml(c.de)}</div>
      </div>
    `;
    options.forEach((o, i) => {
      html += `
        <button class="quiz-option" data-correct="${o.th === c.th}" onclick="answerQuiz(this)">
          <span class="qo-thai">${escapeHtml(o.th)}</span>
          <span class="qo-ph">${escapeHtml(o.phonetic)}</span>
        </button>
      `;
    });
    learnArea.innerHTML = html;
  }

  window.answerQuiz = function (btn) {
    const correct = btn.dataset.correct === 'true';
    quizScore.total++;
    if (correct) quizScore.right++;
    recordResult(currentCard, correct);

    // Show feedback: lock all options, highlight correct/wrong
    document.querySelectorAll('.quiz-option').forEach(b => {
      b.onclick = null;
      if (b.dataset.correct === 'true') b.classList.add('correct');
    });
    if (!correct) btn.classList.add('wrong', 'shake');

    GAMIFY.feedback(correct);
    // Thai-Audio kurz verzögert, damit erst der Feedback-Sound zu hören ist
    setTimeout(() => playAudio(currentCard.th), 500);
    updateLearnStats();
    setTimeout(renderQuiz, correct ? 1400 : 2600);
  };

  // ---------- Learn controls ----------

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      learnMode = btn.dataset.mode;
      learnRefresh();
    });
  });

  learnSource.addEventListener('change', learnRefresh);

  document.getElementById('reset-progress').addEventListener('click', () => {
    const user = AUTH.currentUser();
    if (!user) return;
    if (confirm('Lernfortschritt wirklich zurücksetzen?')) {
      AUTH.resetUserProgress(user);
      quizScore = { right: 0, total: 0 };
      GAMIFY.resetStreak();
      learnRefresh();
    }
  });

  // ==================== HELPERS ====================

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function escapeAttr(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }

  // ==================== INIT ====================

  applyPhoneticSetting();

  if (AUTH.currentUser()) {
    enterApp();
  } else {
    loginOverlay.style.display = 'flex';
    renderBrowseList('all');
  }

  // Show audio support info
  if (!speechSupported) {
    document.getElementById('audio-info').textContent =
      'Audio wird auf diesem Gerät nicht unterstützt.';
    document.getElementById('audio-info').classList.add('warning');
  }

})();
