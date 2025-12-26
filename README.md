# Geocache Bubblesort-Rätsel

Eine interaktive Webanwendung für einen Geocache-Rätselcache, bei der Spieler Tiere nach Größe sortieren müssen, um ein Lösungswort zu finden.

## Konzept

- **8 Tiere** werden in einem Bus mit transparenten Fenstern angezeigt
- Jedes Tier hat **8 individuelle Buchstaben**
- Der aktive Buchstabe eines Tieres hängt von seiner Position im Bus ab (Position 1 = Buchstabe 1, etc.)
- Spieler können **benachbarte Tiere tauschen** (manuell oder automatisch via Bubblesort)
- Nach jedem vollständigen Bubblesort-Durchlauf ergibt sich ein **Lösungswort**
- In diesem Lösungswort ist eine **Zahlenkombination** versteckt

## Projektstruktur

```
/
├── index.html          # Haupt-HTML-Datei
├── style.css           # Styling und Layout
├── script.js           # Spiellogik und Bubblesort
├── README.md           # Diese Datei
└── images/
    ├── bus.png         # Bus mit transparenten Fenstern
    ├── tier1.png       # Tier 1
    ├── tier2.png       # Tier 2
    ├── tier3.png       # Tier 3
    ├── tier4.png       # Tier 4
    ├── tier5.png       # Tier 5
    ├── tier6.png       # Tier 6
    ├── tier7.png       # Tier 7
    └── tier8.png       # Tier 8
```

## Konfiguration

### Tier-Daten anpassen

Öffne `script.js` und bearbeite das `ANIMALS_CONFIG` Array:

```javascript
const ANIMALS_CONFIG = [
    {
        id: 0,
        name: 'Tier1',              // Name des Tieres
        size: 5,                     // Größe (für Sortierung, 1 = kleinste, 8 = größte)
        letters: ['H', 'G', 'Z', 'W', 'E', 'I', 'R', 'T'],  // 8 Buchstaben
        imagePath: 'images/tier1.png'
    },
    // ... weitere 7 Tiere
];
```

**Wichtig:**
- `id`: Fortlaufende Nummer von 0 bis 7
- `size`: Größe des Tieres (1 = kleinstes, 8 = größtes) - bestimmt die Sortierreihenfolge
- `letters`: Array mit genau 8 Buchstaben
  - `letters[0]` = Buchstabe an Position 1 (ganz links)
  - `letters[7]` = Buchstabe an Position 8 (ganz rechts)

### Startreihenfolge anpassen

```javascript
const INITIAL_ORDER = [0, 1, 2, 3, 4, 5, 6, 7];
```

Ändere die Reihenfolge, um eine andere Startaufstellung zu haben (z.B. `[5, 2, 7, 0, 3, 1, 6, 4]`)

## Bilder vorbereiten

### Bus-Bild

1. Erstelle ein Bus-Bild mit **8 transparenten Fenstern** (PNG-Format mit Alpha-Kanal)
2. Die Fenster sollten gleichmäßig verteilt sein
3. Speichere als `images/bus.png`

**Empfohlene Auflösung:** 1600x900 px (16:9 Format)

### Tier-Bilder

1. Erstelle 8 Tier-Bilder als **PNG mit transparentem Hintergrund**
2. Alle Tiere sollten ungefähr die gleiche Größe haben (werden automatisch skaliert)
3. Speichere als `images/tier1.png` bis `images/tier8.png`

**Empfohlene Größe:** 200x200 px

## Lokales Testen

1. Öffne einfach die `index.html` in einem Browser
2. Alle Funktionen laufen komplett im Browser (kein Server nötig)

## Hosting

### Option 1: AWS S3 Static Website (Free Tier)

1. **S3 Bucket erstellen:**
   ```bash
   aws s3 mb s3://geocache-bubblesort
   ```

2. **Dateien hochladen:**
   ```bash
   aws s3 sync . s3://geocache-bubblesort --exclude ".git/*"
   ```

3. **Static Website Hosting aktivieren:**
   - Gehe zu S3 Console → Bucket → Properties → Static Website Hosting
   - Index document: `index.html`
   - Error document: `index.html`

4. **Bucket Policy für öffentlichen Zugriff:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::geocache-bubblesort/*"
       }
     ]
   }
   ```

5. **URL:** `http://geocache-bubblesort.s3-website-[region].amazonaws.com`

### Option 2: GitHub Pages (kostenlos)

1. Erstelle ein GitHub Repository
2. Pushe die Dateien
3. Gehe zu Settings → Pages
4. Source: `main` branch, root folder
5. **URL:** `https://[username].github.io/[repo-name]`

### Option 3: Netlify/Vercel (kostenlos)

1. Drag & Drop den Projektordner auf [netlify.com/drop](https://netlify.com/drop)
2. Fertig!

## Spielanleitung

### Manuelle Steuerung

1. Klicke ein Tier an, um es auszuwählen
2. Klicke ein benachbartes Tier an, um beide zu tauschen
3. Beobachte, wie sich die Buchstaben und das Lösungswort ändern

### Automatische Sortierung (Bubblesort)

1. Klicke auf "Nächster Tausch", um einen Bubblesort-Schritt auszuführen
2. Der Algorithmus vergleicht benachbarte Tiere und tauscht sie, wenn nötig
3. Nach jedem vollständigen Durchlauf (von links nach rechts) siehst du ein Lösungswort
4. Wiederhole, bis alle Tiere sortiert sind

### Zurücksetzen

Klicke auf "Zurücksetzen", um zur Startposition zurückzukehren

## Technische Details

- **Vanilla JavaScript** (keine Frameworks)
- **CSS Grid/Flexbox** für responsives Layout
- **CSS Layers** (z-index) für Bus-Overlay
- **Touch- und Mouse-Events** für Desktop und Mobile
- **Keine externen Dependencies**

## Browser-Kompatibilität

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Browser (iOS Safari, Chrome Mobile)

## Anpassungen

### Farben ändern

Bearbeite in `style.css`:
- Hintergrund-Gradient: `body { background: linear-gradient(...) }`
- Primärfarbe: `#667eea`
- Akzentfarbe: `#764ba2`

### Texte ändern

Bearbeite in `index.html`:
- Titel: `<h1>`
- Anleitung: `.instructions`
- Button-Beschriftungen

## Lizenz

Frei verwendbar für Geocaching-Zwecke.

## Support

Bei Fragen oder Problemen öffne ein Issue im Repository.
