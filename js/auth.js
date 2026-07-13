/**
 * Auth module: Login mit Username/Passwort, per-User Datenhaltung in localStorage.
 *
 * - Passwörter werden NIE im Klartext gespeichert, nur als salted SHA-256 Hash.
 * - Default-User "Marc" wird beim ersten Start angelegt.
 * - Passwort-Reset über Masterpasswort.
 * - Neue Benutzer können sich selbst registrieren.
 */

const AUTH = (function () {
  'use strict';

  const SALT = 'thai-lern-app-2026';
  const USERS_KEY = 'thaiapp_users';
  const SESSION_KEY = 'thaiapp_session';

  // Salted SHA-256 of the default password for user "Marc"
  const DEFAULT_USER = 'Marc';
  const DEFAULT_USER_HASH = 'be4a19e80542c22ce2fafb820826bd221d0efcd8a368b4e8f361bd78246d4e07';
  // Salted SHA-256 of the master password (used only for password reset)
  const MASTER_HASH = 'c1d9f6bb2011aaf57c9df70494a495e1ae9d931860d77b90b1ca44d7ebc81878';

  async function sha256(text) {
    const input = text + SALT;
    if (window.crypto && crypto.subtle) {
      const data = new TextEncoder().encode(input);
      const buf = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }
    // Fallback for browsers/contexts without crypto.subtle (e.g. http:// or old WebViews)
    return sha256Fallback(input);
  }

  function sha256Fallback(ascii) {
    function rightRotate(v, a) { return (v >>> a) | (v << (32 - a)); }
    const mathPow = Math.pow, maxWord = mathPow(2, 32);
    let result = '', words = [], asciiBitLength = ascii.length * 8;
    let hash = [], k = [], primeCounter = 0;
    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii = unescape(encodeURIComponent(ascii));
    asciiBitLength = ascii.length * 8;
    ascii += '\x80';
    while (ascii.length % 64 - 56) ascii += '\x00';
    for (let i = 0; i < ascii.length; i++) {
      words[i >> 2] |= ascii.charCodeAt(i) << ((3 - i) % 4) * 8;
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;
    for (let j = 0; j < words.length;) {
      const w = words.slice(j, j += 16), oldHash = hash.slice(0);
      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ (~e & hash[6])) + k[i]
          + (w[i] = (i < 16) ? w[i] : (w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
        const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? 0 : '') + b.toString(16);
      }
    }
    return result;
  }

  // Case-insensitive username lookup: returns the stored key or null
  function findUserKey(users, username) {
    const lower = username.trim().toLowerCase();
    for (const key of Object.keys(users)) {
      if (key.toLowerCase() === lower) return key;
    }
    return null;
  }

  function loadUsers() {
    let users = {};
    try {
      users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch (e) {
      users = {};
    }
    // Seed default user on first run (or if deleted)
    if (!users[DEFAULT_USER]) {
      users[DEFAULT_USER] = { hash: DEFAULT_USER_HASH, created: '2026-01-01' };
      saveUsers(users);
    }
    return users;
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  async function login(username, password) {
    const users = loadUsers();
    const key = findUserKey(users, username);
    if (!key) return { ok: false, error: 'Benutzer nicht gefunden.' };
    // Trim: Android keyboards often append a space after word suggestions
    const hash = await sha256(password.trim());
    if (hash !== users[key].hash) return { ok: false, error: 'Falsches Passwort.' };
    sessionStorage.setItem(SESSION_KEY, key);
    return { ok: true };
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function currentUser() {
    return sessionStorage.getItem(SESSION_KEY);
  }

  async function register(username, password) {
    username = username.trim();
    password = password.trim();
    if (!username) return { ok: false, error: 'Bitte Benutzernamen eingeben.' };
    if (!/^[A-Za-z0-9_äöüÄÖÜß-]{2,30}$/.test(username)) {
      return { ok: false, error: 'Benutzername: 2-30 Zeichen, nur Buchstaben, Zahlen, - und _.' };
    }
    if (password.length < 4) return { ok: false, error: 'Passwort muss mindestens 4 Zeichen haben.' };
    const users = loadUsers();
    if (findUserKey(users, username)) return { ok: false, error: 'Benutzer existiert bereits.' };
    users[username] = { hash: await sha256(password), created: new Date().toISOString().slice(0, 10) };
    saveUsers(users);
    return { ok: true };
  }

  async function resetPassword(username, masterPassword, newPassword) {
    const users = loadUsers();
    const key = findUserKey(users, username);
    if (!key) return { ok: false, error: 'Benutzer nicht gefunden.' };
    const masterHash = await sha256(masterPassword.trim());
    if (masterHash !== MASTER_HASH) return { ok: false, error: 'Falsches Masterpasswort.' };
    newPassword = newPassword.trim();
    if (newPassword.length < 4) return { ok: false, error: 'Neues Passwort muss mindestens 4 Zeichen haben.' };
    users[key].hash = await sha256(newPassword);
    saveUsers(users);
    return { ok: true };
  }

  function listUsers() {
    return Object.keys(loadUsers()).sort();
  }

  // ==================== PER-USER WORD LIST ====================

  function wordsKey(username) {
    return 'thaiapp_words_' + username;
  }

  function getUserWords(username) {
    try {
      return JSON.parse(localStorage.getItem(wordsKey(username))) || [];
    } catch (e) {
      return [];
    }
  }

  function saveUserWords(username, words) {
    localStorage.setItem(wordsKey(username), JSON.stringify(words));
  }

  function addUserWord(username, entry) {
    const words = getUserWords(username);
    words.push(entry);
    saveUserWords(username, words);
  }

  function deleteUserWord(username, index) {
    const words = getUserWords(username);
    words.splice(index, 1);
    saveUserWords(username, words);
  }

  // ==================== PER-USER LEARNING PROGRESS ====================

  function progressKey(username) {
    return 'thaiapp_progress_' + username;
  }

  function getUserProgress(username) {
    try {
      return JSON.parse(localStorage.getItem(progressKey(username))) || {};
    } catch (e) {
      return {};
    }
  }

  function saveUserProgress(username, progress) {
    localStorage.setItem(progressKey(username), JSON.stringify(progress));
  }

  function resetUserProgress(username) {
    localStorage.removeItem(progressKey(username));
    localStorage.removeItem(scheduleStorageKey(username));
  }

  // ==================== PER-USER WIEDERVORLAGE (SPACED REPETITION) ====================
  // Wann eine Karte wieder gelernt werden soll. Gespeichert als Map
  // Lern-Schlüssel ("de|th") -> { opt: 'now'|'m5'|'d1'|'w1'|'never', due: <ms>|null }.
  // 'never' bedeutet: Karte kommt nicht mehr im Lernsystem dran.

  function scheduleStorageKey(username) {
    return 'thaiapp_schedule_' + username;
  }

  function getUserSchedule(username) {
    try {
      return JSON.parse(localStorage.getItem(scheduleStorageKey(username))) || {};
    } catch (e) {
      return {};
    }
  }

  function setUserScheduleEntry(username, key, entry) {
    const schedule = getUserSchedule(username);
    if (entry === null) delete schedule[key]; else schedule[key] = entry;
    localStorage.setItem(scheduleStorageKey(username), JSON.stringify(schedule));
  }

  // ==================== PER-USER PRIORITY LEARN LIST ====================
  // Wörter, die der Nutzer gezielt (mit hoher Priorität) lernen möchte.
  // Gespeichert als Liste von Lern-Schlüsseln ("de|th").

  function priorityStorageKey(username) {
    return 'thaiapp_priority_' + username;
  }

  function getUserPriorities(username) {
    try {
      return JSON.parse(localStorage.getItem(priorityStorageKey(username))) || [];
    } catch (e) {
      return [];
    }
  }

  // Umschalten; gibt zurück, ob der Eintrag jetzt priorisiert ist
  function toggleUserPriority(username, key) {
    const list = getUserPriorities(username);
    const i = list.indexOf(key);
    if (i >= 0) list.splice(i, 1); else list.push(key);
    localStorage.setItem(priorityStorageKey(username), JSON.stringify(list));
    return i < 0;
  }

  return {
    login, logout, currentUser, register, resetPassword, listUsers,
    getUserWords, addUserWord, deleteUserWord,
    getUserProgress, saveUserProgress, resetUserProgress,
    getUserPriorities, toggleUserPriority,
    getUserSchedule, setUserScheduleEntry
  };
})();
