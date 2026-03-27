# Eesti Statistika Viktoriin

Interaktiivne viktoriinirakendus Eesti statistika teemal. Ehitatud Reactiga, kujundus kooskõlas Statistikaameti visuaalse identiteediga (https://brand.stat.ee/?lang=et).

## Rakendus

🔗 **Live demo:** <https://statistika-viktoriin-merili-tiik.vercel.app/>  

---

## Funktsionaalsus

- 6 valikvastustega küsimust (4 varianti igal)
- Kohene tagasiside pärast iga vastust
- Skoor uueneb reaalajas
- Viktoriini lõpus kokkuvõttetabel ja isikupärastatud lõppsõnum
- Statistikaameti visuaalse identiteedi järgimine kujunduses

---

## Tehnoloogiad

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Playwright](https://playwright.dev/) — E2E testid

---

## Paigaldus ja käivitamine

```bash
# Klooni repo
git clone <repo-url>
cd <repo-kaust>

# Paigalda sõltuvused
npm install

# Käivita arendusserver
npm run dev
```

Rakendus avaneb aadressil `http://localhost:3000`.

---

## Testid

Testid on kirjutatud Playwrightiga. Enne testide käivitamist veendu, et rakendus töötab.

```bash
# Paigalda Playwright brauserid (ainult esimesel korral)
npx playwright install chromium

# Käivita kõik E2E testid (käivitab automaatselt ka dev-serveri)
npx playwright test

# Käivita testid UI režiimis (visuaalne debugger)
npx playwright test --ui

# Käivita testid koos HTML raportiga
npx playwright test --reporter=html
```

### Konfiguratsioon

Playwright kasutab `playwright.config.js` faili. Olulisemad seaded:

- **baseURL:** `http://localhost:3000`
- **brauser:** Chromium (Desktop Chrome)

### Testide kirjeldus

| Test | Kirjeldus |
|------|-----------|
| `avab rakenduse ja kuvab stardivaate` | Kontrollib, et logo, pealkiri ja stardinupp on nähtavad |
| `saab küsimusele vastata ja näeb tagasisidet` | Valib vastuse, kinnitab ja kontrollib tagasiside ilmumist |
| `punktisumma suureneb õige vastuse korral` | Kontrollib, et skoor muutub 0 → 1 pärast õiget vastust |
| `vale vastuse korral kuvatakse veateade ja õige vastus` | Kontrollib vale vastuse visuaalset märgistust ja skoor jääb 0 |
| `viktoriini lõpus kuvatakse tulemused tabelina` | Läbib kõik 6 küsimust ja kontrollib tulemustabelit |
| `saab uuesti alustada pärast viktoriini lõppu` | Kontrollib "Alusta uuesti" nuppu ja oleku lähtestamist |

---

## Projekti struktuur

```
src/
├── App.jsx          # Peakomponent ja ekraanid (Start, Question, Results)
├── App.css          # Kujundus (Statistikaamet CVI)
├── kysimused.js     # Küsimuste andmed
├── statistika.png   # Statistikaameti logo
└── main.jsx         # Rakenduse sisenemispunkt

tests/
└── viktoriin.spec.js    # Playwright E2E testid
playwright.config.js     # Playwright konfiguratsioon
```