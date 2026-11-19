# Polyverse — Everyday life, molecular magic

A responsive, browser-based learning website about polymers in daily life. Pico is the friendly guide character.

## Run it

1. Keep `index.html`, `styles.css`, and `app.js` in the same folder.
2. Open the folder in VS Code.
3. Use VS Code's Live Server extension, or run a small local web server from this folder:

   ```bash
   python3 -m http.server 8000
   ```

4. Open `http://localhost:8000` in your browser.

You can also publish the folder using GitHub Pages. No backend or database is required.

## Features

- Daily-life object explorer with clickable items.
- Eight polymer profiles: Kevlar, polyaniline (PANI), PLA, PTFE, PET, PVC, Nylon 6,6 and polyethylene.
- Searchable polymer library.
- Random science facts from Pico.
- Interactive 3D ball-and-stick repeat-unit illustrations. Drag to rotate and use the wheel or zoom slider to zoom.
- Responsive layout for desktop, tablet and mobile.

## 3D and internet connection

Three.js and OrbitControls are loaded from jsDelivr using ES modules. The first time the page loads, an internet connection is needed to download these libraries. The rest of the page is static and does not need a server-side backend.

The 3D molecular structures are **schematic educational illustrations**, not crystallographic or scale-accurate models. The polymer chemistry text provides the intended context. In particular, PLA biodegradability depends on grade and composting conditions, and polyaniline conductivity depends on oxidation state and doping.

## Project files

- `index.html` — page structure and content sections
- `styles.css` — visual design, responsive layout and animations
- `app.js` — polymer data, navigation, random facts and Three.js molecular viewer
