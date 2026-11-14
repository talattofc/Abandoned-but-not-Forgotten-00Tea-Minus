<div align="center">

# Abandoned but not Forgotten — `00Tea-Minus`

**An interactive, kid-friendly NASA space hardware museum & engineering playground across the Solar System.**

![React](https://img.shields.io/badge/React-18-141A29?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-141A29?style=for-the-badge&logo=typescript&logoColor=3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-141A29?style=for-the-badge&logo=tailwind-css&logoColor=38BDF8)
![Vite](https://img.shields.io/badge/Vite-5-141A29?style=for-the-badge&logo=vite&logoColor=646CFF)
![NASA Open Media](https://img.shields.io/badge/Media-NASA_Public_Domain-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)

*Explore 6 iconic pieces of NASA cosmic hardware left on **The Moon**, **Mars**, and **Deep Space**—through real NASA archives, voice-narrated stories, engineering failure labs, light-speed pings, and 6 custom mini-games.*

</div>

---

## Features

- **Interactive Solar System Map:** Explore **The Moon**, **Mars**, and **Deep Space** (plus informational tooltips for Mercury, Venus, Earth, Jupiter, Saturn, Uranus, and Neptune).
- **4-Chapter Mission Stories + Voice Mode:** Kid-friendly, scientifically verified storytelling paired with real NASA archival photos, looping videos, media-type badges (`REAL NASA PHOTO`, `REAL NASA VIDEO`, `NASA SIMULATION`, `NASA ARTIST CONCEPT`), and native **Web Speech API** narration.
- **Interactive Blueprint & Environment Test Chamber:**
  - **Phase 1:** Inspect real NASA hardware schematics and individual transparent component assets.
  - **Phase 2:** Assemble spacecraft using real NASA parts vs. Earth-style decoys—and watch **live visual failure simulations** (cryogenic freezing at `-170°C`, no-O₂ engine stalls, thin-air lift failure, deep-space power blackouts) when wrong parts are tested.
- **Ping the Hardware (Speed of Light Simulator):** Send a radio pulse at `~300,000 km/s` from Earth and see real one-way travel times (`~1.28s` to the Moon, minutes to Mars, hours to Deep Space).
- **6 Unique Educational Mini-Games:** Every spacecraft has its own custom, hands-on simulation (detailed below).
- **Mission Quizzes, Cosmic Coins & Avatar Shop:** Unlock quizzes after completing stories, earn Cosmic Coins (`+50` first clear / `+25` replay), customize your Explorer Callsign, and unlock custom space avatars & HUD frames.
- **Synthesized Mission-Control Audio:** Zero-dependency Web Audio API click, sonar ping, shutter, success, and alert sound effects with a global mute toggle.

---

## Missions & Mini-Games (`2 + 2 + 2`)

| Destination | Hardware | Power Source | Mini-Game |
| :--- | :--- | :--- | :--- |
| **The Moon** | **Apollo 15 LRV-1 ("Moon Buggy")** | Battery | **Origami Unfold & Lunar Drive** — Drag the deployment lanyard to unfold LRV-1, steer top-down across Hadley-Apennine craters, escape lunar dust traps, and collect 5 moon rocks. |
| **The Moon** | **Apollo 12 ALSEP** | Nuclear RTG (`SNAP-27`) | **Power & Cable Routing** — Slide and rotate lunar cable tiles to route nuclear power through the Central Station to both the Seismometer and Magnetometer. |
| **Mars** | **Spirit & Opportunity** | Solar Panels | **Bounce Landing & Mars Photo Explorer** — Survive the animated airbag bounce landing, steer around steep craters, and snap Pancam photos of hematite *"blueberries"* and ancient water rocks. |
| **Mars** | **Ingenuity Mars Helicopter** | Solar + Li-Ion | **Super-Spin & Mars Scout Flight** — Scroll your mouse wheel to rev coaxial blades past `2,537 RPM` in Mars's 1% air, photograph Perseverance, and land safely on the helipad. |
| **Deep Space** | **Pioneer 10** | Nuclear RTG (`SNAP-19`) | **Jupiter Gravity Slingshot** — Tune launch angle and speed to whip Pioneer 10 around Jupiter's gravity well and through the Deep Space Exit Gate toward Aldebaran. |
| **Deep Space** | **Kepler Space Telescope** | Solar Array | **Exoplanet Telescope Explorer** — Pan across the Cygnus starfield, spot blinking transit stars, and photograph 4 iconic exoplanets (`Kepler-186f`, `22b`, `16b`, `10b`). |

---

## Run Locally

Requires [Node.js 18+](https://nodejs.org/) (LTS recommended).

```bash
npm install
npm run dev      # Start local dev server at http://localhost:5173
npm run build    # Type-check and build for production
```

---

## NASA Media Attribution & Scientific Sources

This is an educational project using public domain imagery, video, and mission facts courtesy of **NASA / JPL-Caltech / Ames Research Center** ([science.nasa.gov](https://science.nasa.gov) & [nssdc.gsfc.nasa.gov](https://nssdc.gsfc.nasa.gov)):

- [Apollo 15 Lunar Roving Vehicle (1971-063C)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C)
- [Apollo 12 ALSEP (1969-099C)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C)
- [Mars Exploration Rovers: Spirit & Opportunity](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/)
- [Ingenuity Mars Helicopter](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/)
- [Pioneer 10](https://science.nasa.gov/mission/pioneer-10/)
- [Kepler Space Telescope](https://science.nasa.gov/mission/kepler/)

---

## Credits

- **Creators:** `@talatt` & `@micir`
- **Tester:** Nazlı Aydın
- **Special Thanks:** Vedat Aydın
