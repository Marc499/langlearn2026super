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

  function translate() {
    const query = inputField.value.trim();
    if (!query) {
      showMessage('Bitte geben Sie einen Satz oder ein Wort ein.');
      return;
    }

    const results = searchPhrases(query);

    if (results.length === 0) {
      showMessage(
        'Keine Übersetzung gefunden für: "' + query + '"<br>' +
        '<small>Versuchen Sie ein anderes Wort oder schauen Sie in der Wortliste.</small>'
      );
      return;
    }

    renderResults(results);
  }

  function showMessage(html) {
    resultsContainer.innerHTML =
      '<div class="no-result">' + html + '</div>';
  }

  function renderResults(results) {
    let html = '';
    for (const r of results) {
      let matchLabel = r.matchType === 'exact' ? 'Exakter Treffer' :
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
        </div>
      `;
    }
    resultsContainer.innerHTML = html;
  }

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
              <div class="result-row">
                <span class="result-label">Phonetik:</span>
                <span class="result-value phonetic-text">${escapeHtml(p.phonetic)}</span>
              </div>
              <div class="result-row">
                <span class="result-label">Wort-für-Wort:</span>
                <span class="result-value word-by-word">${escapeHtml(p.wordByWord)}</span>
              </div>
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
          <div class="result-row">
            <span class="result-label">Phonetik:</span>
            <span class="result-value phonetic-text">${escapeHtml(p.phonetic)}</span>
          </div>
          <div class="result-row">
            <span class="result-label">Wort-für-Wort:</span>
            <span class="result-value word-by-word">${escapeHtml(p.wordByWord)}</span>
          </div>
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
