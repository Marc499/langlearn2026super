# langlearn2026super

Hauptseite (`/`): Thai-Lern-App (Deutsch/Englisch → Thai).

Sprachtrainer als eigene Unterordner, jeweils eine einzelne `index.html` mit geführter Übung
(deutscher Satz → Denkpause → Zielsprache Wort für Wort → Nachsprechen mit Spracherkennung, am besten in Chrome):

| Ordner | Sprache | Stand |
|---|---|---|
| `chinesisch/` | Mandarin | fertig |
| `portugiesisch-brasilien/` | Portugiesisch (Brasilien, pt-BR) | fertig |
| `portugiesisch-portugal/` | Portugiesisch (Portugal, pt-PT) | geplant |
| `thai/` | Thai | geplant |

Neue Sprache: `portugiesisch-brasilien/index.html` kopieren und dort nur das Objekt `LANG`,
`CHAPTERS` und `phrases` austauschen. Der Lernstand wird je Sprache getrennt im Browser gespeichert
(`LANG.key`).

## Veröffentlichen

**Jetzt: GitHub Pages.** Branch `main`, Ordner `/ (root)`. Jeder Push auf `main` veröffentlicht neu
(ca. 1 Minute). Adressen:

- `https://marc499.github.io/langlearn2026super/` – Thai (Hauptseite, mit Links zu den anderen Sprachen)
- `https://marc499.github.io/langlearn2026super/chinesisch/`
- `https://marc499.github.io/langlearn2026super/portugiesisch-brasilien/`

GitHub Pages geht im kostenlosen Konto nur mit **öffentlichem** Repository.

**Später: Cloudflare, Repository privat.** Vorbereitet sind `wrangler.jsonc`, `.assetsignore` und `_headers`
(gleiches Muster wie im Repo HeikesNatur). Ablauf:

1. Cloudflare-Dashboard → Workers & Pages → Create → *Import a repository* → `langlearn2026super`,
   Branch `main`. Build-Befehl leer lassen, Deploy-Befehl `npx wrangler deploy`.
2. Prüfen, dass `…workers.dev` alle drei Seiten zeigt.
3. Optional Zugang sperren: Cloudflare Zero Trust → Access → Application für die Adresse anlegen,
   Anmeldung per E-Mail-Code nur für eigene Adressen.
4. Erst dann auf GitHub Settings → General → *Change visibility* → Private. GitHub Pages schaltet sich
   dabei ab; Cloudflare liest das private Repository über die GitHub-App weiter.
