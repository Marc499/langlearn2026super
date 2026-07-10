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
    const data = new TextEncoder().encode(text + SALT);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
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
    const user = users[username];
    if (!user) return { ok: false, error: 'Benutzer nicht gefunden.' };
    const hash = await sha256(password);
    if (hash !== user.hash) return { ok: false, error: 'Falsches Passwort.' };
    sessionStorage.setItem(SESSION_KEY, username);
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
    if (!username) return { ok: false, error: 'Bitte Benutzernamen eingeben.' };
    if (!/^[A-Za-z0-9_äöüÄÖÜß-]{2,30}$/.test(username)) {
      return { ok: false, error: 'Benutzername: 2-30 Zeichen, nur Buchstaben, Zahlen, - und _.' };
    }
    if (password.length < 4) return { ok: false, error: 'Passwort muss mindestens 4 Zeichen haben.' };
    const users = loadUsers();
    if (users[username]) return { ok: false, error: 'Benutzer existiert bereits.' };
    users[username] = { hash: await sha256(password), created: new Date().toISOString().slice(0, 10) };
    saveUsers(users);
    return { ok: true };
  }

  async function resetPassword(username, masterPassword, newPassword) {
    const users = loadUsers();
    if (!users[username]) return { ok: false, error: 'Benutzer nicht gefunden.' };
    const masterHash = await sha256(masterPassword);
    if (masterHash !== MASTER_HASH) return { ok: false, error: 'Falsches Masterpasswort.' };
    if (newPassword.length < 4) return { ok: false, error: 'Neues Passwort muss mindestens 4 Zeichen haben.' };
    users[username].hash = await sha256(newPassword);
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

  return {
    login, logout, currentUser, register, resetPassword, listUsers,
    getUserWords, addUserWord, deleteUserWord
  };
})();
