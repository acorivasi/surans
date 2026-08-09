# LocLiber — demo prototip pentru Sectorul 2, București

Prototip funcțional (1 pagină) pentru validarea ideii: o hartă comunitară cu locuri de parcare publice raportate de vecini (gratuit) + o piață de locuri private de închiriat (garaje, curți, locuri de birou libere).

Combină două direcții discutate:
1. **Raportare comunitară** — utilizatorii marchează „am parcat aici" / „am plecat" pe locuri publice.
2. **Marketplace privat** — proprietari listează un loc neutilizat cu preț/oră sau /zi; alți utilizatori trimit cerere de rezervare.

## Structură

```
parcare-sector2-demo/
├── index.html       Pagina unică: hero, hartă, cum funcționează, marketplace privat
├── css/style.css
├── js/main.js        Logica hărții, toggle status, modal de rezervare, simulare activitate
└── README.md
```

## Ce e deja funcțional în acest demo

- **Hartă interactivă** (Leaflet + OpenStreetMap, fără cheie API) centrată pe zone din Sectorul 2 (Obor, Iancului, Pantelimon, Colentina, Traian etc.).
- **10 locuri publice mock**, colorate verde/roșu; click pe marker → poți marca „am parcat aici" / „am plecat", iar starea se salvează în `localStorage` (persistă la refresh, simulează o bază de date).
- **4 locuri private mock** (marker albastru) cu preț/oră și /zi; buton „Rezervă" deschide un formular (dată, oră, durată) cu calcul de preț estimat — trimiterea afișează doar o confirmare vizuală (fără backend/plată reală).
- **Simulare de activitate comunitară** — la fiecare ~25 secunde, un loc public își schimbă aleator statusul, cu un toast „Un vecin a raportat...", ca să dea senzația de hartă „vie" într-o demonstrație live.
- Bară de statistici (locuri libere / total / private disponibile), buton de reset al demo-ului.

## Cum vezi demo-ul local

Deschide `index.html` direct în browser, sau:

```bash
python3 -m http.server 8080
```

apoi accesează `http://localhost:8080/parcare-sector2-demo/`.

## Ce lipsește pentru o aplicație reală (producție)

### 1. Backend + bază de date reală
Momentan totul e simulat în `localStorage`, vizibil doar în browserul tău. Pentru utilizatori reali e nevoie de:
- API + bază de date (ex. PostgreSQL/Firebase/Supabase) care stochează locurile, statusul și cine/când a raportat.
- Actualizare în timp real între utilizatori (WebSockets sau polling) — momentan fiecare browser are propria stare locală.

### 2. Conturi de utilizator
Autentificare (email/telefon, sau OAuth Google) — necesară pentru a lega raportările de o persoană (reputație, evitarea raportărilor false) și pentru a gestiona rezervările din marketplace.

### 3. Anti-fraudă / calitatea datelor
- Validare GPS (raportarea trebuie să vină de la un telefon aflat efectiv lângă locul respectiv).
- Expirare automată a statusului „liber"/„ocupat" după un interval, dacă nimeni nu confirmă.
- Scor de încredere per utilizator (raportări corecte vs. incorecte).

### 4. Plăți reale pentru marketplace-ul privat
Integrare cu un procesator de plăți (Stripe, Netopia, PayU) pentru rezervări confirmate + comisionul platformei. Necesită și clarificare legală (contract de închiriere, TVA/fiscalitate pentru proprietari, răspundere în caz de pagube).

### 5. Aplicație mobilă / PWA
Pentru raportare rapidă „din mers", o aplicație web progresivă (PWA) sau nativă (iOS/Android) e mult mai practică decât un site deschis din browser — permite notificări push și acces facil la GPS.

### 6. Lansare hiperlocală
Recomandat: pilot pe câteva străzi/cartiere din Sectorul 2 (nu tot sectorul din prima), cu un grup inițial de vecini recrutați manual, ca să depășești problema de „cold start" (harta trebuie să aibă suficiente raportări ca să fie utilă).

## Nume, coordonate și date

Toate străzile, prețurile și proprietarii din acest demo sunt **fictive**, alese doar pentru a arăta conceptul într-un context geografic real (Sectorul 2, București). Nu reprezintă locuri sau persoane reale.
