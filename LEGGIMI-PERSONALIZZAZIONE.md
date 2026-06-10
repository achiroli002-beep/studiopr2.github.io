# Sito dello studio — Guida alla personalizzazione

Sito statico (HTML + CSS + JS vanilla, nessuna libreria): basta caricare la
cartella su qualsiasi hosting. Per provarlo in locale: aprire `index.html`
nel browser, oppure `python3 -m http.server` nella cartella.

## Struttura

```
index.html            Home (hero, perché multidisciplinare, CTA)
chi-siamo.html        Missione, approccio, ambienti
professionisti.html   Griglia delle 6 schede con filtro per ambito
servizi.html          Panoramica per area con rimando ai professionisti
prenota.html          Prenotazione: scelta professionista → calendario
contatti.html         Indirizzo, mappa, orari, come raggiungerci
privacy-policy.html   Segnaposto: far redigere/validare da consulente privacy
cookie-policy.html    Segnaposto: idem
sitemap.xml, robots.txt
assets/css/style.css  Stile (variabili di brand in cima al file)
assets/js/main.js     Menu, animazioni, filtro, prenotazione, banner cookie
assets/img/           Inserire qui foto professionisti e ambienti
```

## 1. Dati da sostituire (cerca-e-sostituisci globale)

| Segnaposto | Dove |
|---|---|
| `[NOME STUDIO]`, `[CLAIM...]` | tutte le pagine |
| `[DOMINIO]` | tag canonical, sitemap, robots.txt |
| `[CITTÀ]`, `[CAP]`, `[VIA E NUMERO CIVICO]` | footer, contatti, schema.org |
| `[+39 TELEFONO]` e `[+39TELEFONO]` (nei link `tel:`) | header/footer/contatti |
| `[EMAIL]`, `[PARTITA IVA]`, `[ORARI...]` | footer, contatti, privacy |
| `[NOME COGNOME 1..6]`, `[AMBITO CLINICO...]` | professionisti.html, servizi.html, prenota.html |
| `[URL_SITO_PERSONALE_1..6]` | pulsanti "Vai al sito" (si aprono in nuova scheda con `rel="noopener"`) |
| `[INSERIRE_EMBED_PRENOTAZIONI_1..6]` | prenota.html (vedi punto 3) |

## 2. Foto dei professionisti

In `professionisti.html`, dentro ogni `<div class="pebble pebble--N">`,
sostituire il `<div class="pebble__ph">…</div>` con:

```html
<img src="assets/img/nome-cognome.jpg" alt="Ritratto di [Nome Cognome]" loading="lazy" width="248" height="248">
```

La forma organica ("ciottolo") e l'ottimizzazione sono già gestite dal CSS.
Consigli: foto quadrate ~500×500 px, formato WebP o JPEG ottimizzato (<80 KB).

## 3. Sistema di prenotazione

In `prenota.html` ci sono sei blocchi `<div class="embed-slot" id="embed-pN">`.
Per ciascuno, sostituire il blocco `.embed-placeholder` con il codice embed
fornito dal servizio scelto (MioDottore/Doctolib, Calendly, Cal.com…).

Per la conformità GDPR, caricare lo script del widget **dopo il consenso**:

```html
<script type="text/plain" data-consent="booking" src="https://...widget.js"></script>
```

`main.js` attiva automaticamente questi script quando l'utente preme
"Accetta tutti" nel banner. I pulsanti "Prenota con [Nome]" delle schede
puntano già a `prenota.html?pro=pN` e aprono il calendario giusto.

Importante (dati sanitari): configurare i moduli del servizio di prenotazione
per raccogliere **solo dati di contatto** (nome, telefono, email), mai motivi
clinici o dati sulla salute.

## 4. Palette e tipografia

Tutto in cima a `assets/css/style.css` (`:root`):

- `--paper`, `--ink`, `--accent` → colori di base e CTA (verde bosco);
- `--c-psicologia` (glicine), `--c-logopedia` (ocra), `--c-fisioterapia`
  (salvia) → codifica cromatica delle tre aree, usata in chip, filtri, hero;
- font: Fraunces (titoli) + Albert Sans (testo), caricati da Google Fonts.
  Per cambiarli: aggiornare il `<link>` nei `<head>` e le variabili
  `--font-display` / `--font-body`.

## 5. Mappa, SEO, privacy

- **Mappa**: in `contatti.html` incollare l'iframe di Google Maps nel blocco
  `.map-frame` (o lasciare il solo link esterno, soluzione più rispettosa
  della privacy perché non carica risorse Google senza consenso).
- **SEO**: ogni pagina ha `title`, `meta description` e `canonical` propri;
  in `index.html` compilare il blocco JSON-LD `MedicalBusiness`.
- **Privacy/Cookie policy**: i testi inclusi sono SEGNAPOSTO. Vanno redatti o
  validati da un consulente privacy prima della messa online (settore
  sanitario = particolare attenzione).

## Note tecniche

- Mobile-first: griglie a 1 colonna sotto i 640 px, 2 colonne fino a 920 px;
  tutti i target tattili ≥ 44 px.
- Accessibilità: skip-link, focus visibile, `aria-current`, `aria-pressed`
  su filtri e selettori, `prefers-reduced-motion` rispettato.
- Nessuna dipendenza esterna oltre ai font: caricamento molto rapido.
