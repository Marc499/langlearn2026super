/**
 * KI-Übersetzung: Deutsch/Englisch -> Thai über Gemini (kostenlos) oder OpenAI.
 *
 * - Der API-Schlüssel wird NUR lokal auf dem Gerät gespeichert (localStorage)
 *   und landet nie im Code oder auf GitHub.
 * - Anbieter wird automatisch am Schlüssel erkannt:
 *     "AIza..." -> Google Gemini (kostenloses Kontingent)
 *     "sk-..."  -> OpenAI (gpt-4o-mini, sehr günstig)
 * - Liefert Thai-Schrift, Phonetik UND Wort-für-Wort in einer Anfrage,
 *   im selben Format wie das Offline-Wörterbuch.
 * - Ohne Schlüssel oder ohne Internet bleibt alles beim Offline-Wörterbuch.
 */

const AI_TRANSLATE = (function () {
  'use strict';

  const KEY_STORAGE = 'thaiapp_apikey';

  // Gemini-Modelle: das erste erreichbare wird verwendet (Alias zuerst)
  const GEMINI_MODELS = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];
  const OPENAI_MODEL = 'gpt-4o-mini';

  function getKey() {
    return (localStorage.getItem(KEY_STORAGE) || '').trim();
  }

  function setKey(key) {
    if (key) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
  }

  function hasKey() {
    return getKey().length > 0;
  }

  function provider() {
    const key = getKey();
    if (key.startsWith('AIza')) return 'gemini';
    if (key.startsWith('sk-')) return 'openai';
    return key ? 'unbekannt' : null;
  }

  function providerName() {
    const p = provider();
    return p === 'gemini' ? 'Gemini' : p === 'openai' ? 'OpenAI' : 'KI';
  }

  function buildPrompt(query) {
    return 'Du bist Übersetzer für eine Thai-Sprachlern-App (Deutsch/Englisch -> Thai).\n' +
      'Übersetze diesen Satz: "' + query + '"\n\n' +
      'Antworte NUR mit einem JSON-Objekt mit exakt diesen Feldern:\n' +
      '{\n' +
      '  "de": "die Eingabe auf Deutsch (bei englischer Eingabe: deutsche Übersetzung)",\n' +
      '  "en": "englische Übersetzung",\n' +
      '  "th": "Thai-Übersetzung, einzelne Thai-Wörter durch Leerzeichen getrennt",\n' +
      '  "phonetic": "phonetische Umschrift mit Tonzeichen (z.B. chǎn gam-lang tham), ein Umschrift-Wort pro Thai-Wort",\n' +
      '  "wordByWord": "wörtliche deutsche Rückübersetzung, ein deutsches Wort/Begriff pro Thai-Wort"\n' +
      '}\n' +
      'Wichtig: th, phonetic und wordByWord müssen gleich viele durch Leerzeichen getrennte Einheiten haben. ' +
      'Verwende natürliches, gesprochenes Thai (umgangssprachliches Register, ohne Höflichkeitspartikel).';
  }

  async function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs || 20000);
    try {
      return await fetch(url, Object.assign({ signal: controller.signal }, options));
    } finally {
      clearTimeout(timer);
    }
  }

  async function callGemini(query, key) {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(query) }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
    });

    let lastError = 'Gemini nicht erreichbar.';
    for (const model of GEMINI_MODELS) {
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model +
        ':generateContent?key=' + encodeURIComponent(key);
      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      });
      if (res.status === 404) { lastError = 'Modell ' + model + ' nicht gefunden.'; continue; }
      if (res.status === 400 || res.status === 401 || res.status === 403) {
        throw new Error('API-Schlüssel ungültig oder nicht freigeschaltet (HTTP ' + res.status + ').');
      }
      if (res.status === 429) {
        throw new Error('Tageslimit/Rate-Limit erreicht. Bitte später erneut versuchen.');
      }
      if (!res.ok) { lastError = 'Gemini-Fehler (HTTP ' + res.status + ').'; continue; }
      const data = await res.json();
      const text = data && data.candidates && data.candidates[0] &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
      if (!text) throw new Error('Leere Antwort von Gemini.');
      return text;
    }
    throw new Error(lastError);
  }

  async function callOpenAI(query, key) {
    const res = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: 'user', content: buildPrompt(query) }],
        response_format: { type: 'json_object' },
        temperature: 0.2
      })
    });
    if (res.status === 401) throw new Error('API-Schlüssel ungültig.');
    if (res.status === 429) throw new Error('Rate-Limit oder Guthaben aufgebraucht.');
    if (!res.ok) throw new Error('OpenAI-Fehler (HTTP ' + res.status + ').');
    const data = await res.json();
    const text = data && data.choices && data.choices[0] &&
      data.choices[0].message && data.choices[0].message.content;
    if (!text) throw new Error('Leere Antwort von OpenAI.');
    return text;
  }

  function parseResult(text, query) {
    let obj;
    try {
      obj = JSON.parse(text);
    } catch (e) {
      // Falls das Modell den JSON-Block in Text einbettet
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error('Antwort war kein gültiges JSON.');
      obj = JSON.parse(m[0]);
    }
    if (!obj.th) throw new Error('Antwort enthält keine Thai-Übersetzung.');
    return {
      de: obj.de || query,
      en: obj.en || query,
      th: obj.th,
      phonetic: obj.phonetic || '-',
      wordByWord: obj.wordByWord || '-'
    };
  }

  /**
   * Übersetzt eine Eingabe per KI.
   * @returns {Promise<{de,en,th,phonetic,wordByWord}>}
   */
  async function translate(query) {
    const key = getKey();
    if (!key) throw new Error('Kein API-Schlüssel hinterlegt.');
    const p = provider();
    let text;
    if (p === 'gemini') text = await callGemini(query, key);
    else if (p === 'openai') text = await callOpenAI(query, key);
    else throw new Error('Schlüsselformat nicht erkannt (erwartet "AIza..." für Gemini oder "sk-..." für OpenAI).');
    return parseResult(text, query);
  }

  // ==================== EINSTELLUNGS-UI ====================

  function initSettingsUI() {
    const input = document.getElementById('ai-key-input');
    const saveBtn = document.getElementById('ai-key-save');
    const removeBtn = document.getElementById('ai-key-remove');
    const status = document.getElementById('ai-key-status');
    if (!input || !saveBtn || !removeBtn || !status) return;

    function render() {
      if (hasKey()) {
        const p = provider();
        if (p === 'unbekannt') {
          status.textContent = '⚠️ Schlüssel gespeichert, aber Format nicht erkannt (erwartet "AIza..." oder "sk-...").';
          status.className = 'ai-status warn';
        } else {
          status.textContent = '✅ ' + providerName() + '-Schlüssel aktiv (nur auf diesem Gerät gespeichert).';
          status.className = 'ai-status ok';
        }
        input.value = '';
        input.placeholder = '•••••••• (Schlüssel gespeichert)';
        removeBtn.style.display = '';
      } else {
        status.textContent = 'Kein Schlüssel hinterlegt – es wird nur das Offline-Wörterbuch genutzt.';
        status.className = 'ai-status';
        input.placeholder = 'AIza... (Gemini, gratis) oder sk-... (OpenAI)';
        removeBtn.style.display = 'none';
      }
    }

    saveBtn.addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) { render(); return; }
      setKey(val);
      render();
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); saveBtn.click(); }
    });

    removeBtn.addEventListener('click', () => {
      setKey('');
      render();
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', initSettingsUI);
  if (document.readyState !== 'loading') initSettingsUI();

  return { translate, hasKey, provider, providerName };
})();
