<div align="center">

# Mission Echo – by 00Tea-Minus

**An interactive NASA space exploration and engineering playground for the next generation.**

![React](https://img.shields.io/badge/React-18-141A29?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-141A29?style=for-the-badge&logo=typescript&logoColor=3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-141A29?style=for-the-badge&logo=tailwind-css&logoColor=38BDF8)
![Vite](https://img.shields.io/badge/Vite-5-141A29?style=for-the-badge&logo=vite&logoColor=646CFF)
![NASA Mission Resources](https://img.shields.io/badge/Sources-NASA_Mission_Resources-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)

**Live App:** [abandoned-but-not-forgotten-00-tea.vercel.app](https://abandoned-but-not-forgotten-00-tea.vercel.app/) • **Repository:** [github.com/talattofc/Abandoned-but-not-Forgotten-00Tea-Minus](https://github.com/talattofc/Abandoned-but-not-Forgotten-00Tea-Minus)

</div>

---

## About the Challenge

Created by **00Tea-Minus** for **NASA Space Apps Challenge 2026** ([spaceappschallenge.org](https://www.spaceappschallenge.org/)) under the **"NASA's Discarded Equipment Storytelling"** challenge.

---

## The Problem

Historic spacecraft left on the Moon, inside Martian craters, and drifting into deep space are often viewed as static museum trivia rather than living feats of human engineering. Young learners rarely get to experience *why* those machines were built the way they were, *what* harsh environments they endured, or *how* their missions continue to inspire exploration today.

---

## Our Solution

**MISSION ECHO — The Stories Behind Space Exploration** transforms 6 iconic pieces of NASA hardware across **The Moon**, **Mars**, and **Deep Space** into an interactive, voice-narrated mission-control playground. Learners explore real archival NASA photos and videos, test spacecraft parts inside an interactive failure-simulation chamber, measure speed-of-light radio delays, and pilot 6 custom educational mini-games.

---

## Target Audience

> Mission Echo is primarily designed for children aged 10–12, while offering different levels of exploration for younger and older learners. Younger users can engage through visuals and interactive games, while older learners can explore technical explanations and access official NASA resources for deeper research.

- **Ages 8–10:** Basic exploration through visuals and interactive mini-games.
- **Ages 10–12 (Primary Audience):** Mission stories, games, engineering experiments, and interactive learning.
- **Ages 12+:** Detailed mission data, engineering explanations, and direct links to official NASA scientific resources.

---

## Features

- **Interactive Solar System Map:** Explore **The Moon**, **Mars**, and **Deep Space** (with informational previews for planets across the Solar System).
- **4-Chapter Mission Stories + Voice Mode:** Scientifically grounded storytelling paired with real NASA archival photos, looping videos, explicit media badges (`REAL NASA PHOTO`, `REAL NASA VIDEO`, `NASA SIMULATION`, `NASA ARTIST CONCEPT`), and native **Web Speech API** narration.
- **Blueprint & Environment Test Chamber:** Inspect spacecraft components in Phase 1, then assemble hardware using real NASA parts vs. Earth-style decoys in Phase 2—triggering visual failure tests (`-170°C` cryogenic freeze, no-O₂ engine stall, thin-air lift failure, or deep-space power blackout) when mismatched parts are tested.
- **Ping the Hardware (Speed of Light Simulator):** Transmit a simulated radio pulse at `~300,000 km/s` from Earth and compare real one-way light-travel times (`~1.28s` to the Moon, minutes to Mars, hours to Deep Space).
- **6 Custom Educational Mini-Games:** Every spacecraft features a bespoke, kid-friendly interactive simulation.
- **Mission Quizzes, Cosmic Coins & Avatar Shop:** Unlock quizzes, earn Cosmic Coins (`+50` first clear / `+25` replay), customize your Explorer Callsign and Mission Rank (`Space Cadet` → `Solar System Master`), and unlock space avatars and HUD badge frames persisted in `localStorage`.
- **Synthesized Web Audio SFX:** Zero-dependency Web Audio API click, sonar ping, shutter, success, and alert sounds with a global mute toggle in the Top HUD.

---

## Missions & Mini-Games

| Destination | Hardware | Power Source | Mini-Game |
| :--- | :--- | :--- | :--- |
| **The Moon** | **Apollo 15 LRV-1 ("Moon Buggy")** | Battery | **Origami Unfold & Lunar Drive** — Drag the deployment lanyard to unfold LRV-1, steer across Hadley-Apennine craters, escape dust traps, and collect 5 lunar samples. |
| **The Moon** | **Apollo 12 ALSEP** | Nuclear RTG (`SNAP-27`) | **ALSEP Power & Cable Routing** — Slide and rotate cable tiles across the lunar grid to route `SNAP-27` power through the Central Station to the Seismometer and Magnetometer. |
| **Mars** | **Spirit & Opportunity** | Solar Panels | **Bounce Landing & Mars Photo Explorer** — Watch Opportunity's airbag bounce landing, steer around steep craters, and snap Pancam photos of hematite *"blueberries"* and ancient water rocks. |
| **Mars** | **Ingenuity Mars Helicopter** | Solar + Li-Ion | **Super-Spin & Mars Scout Flight** — Rev coaxial rotors past `2,537 RPM` for Mars's `1%` air density, capture aerial scout photos over Perseverance, and land on the helipad. |
| **Deep Space** | **Pioneer 10** | Nuclear RTG (`SNAP-19`) | **Jupiter Gravity Slingshot** — Tune launch angle and speed so Jupiter's gravity well whips Pioneer 10 through the Deep Space Exit Gate toward Aldebaran. |
| **Deep Space** | **Kepler Space Telescope** | Solar Array | **Exoplanet Transit Explorer** — Pan Kepler's photometer across Cygnus, spot blinking transit stars, and record Stellar Brightness Light Curves to confirm 4 Exoplanet Candidates. |

---

## How We Used NASA Data

Mission Echo uses curated mission facts, engineering parameters, and archival media sourced from NASA Science, NASA NSSDCA, JPL-Caltech, and NASA Ames Research Center—stored as structured local TypeScript datasets (`src/data/hardwareData.ts` and `src/data/destinationsData.ts`) and local archival media assets (`public/story/`). Each hardware hub also links directly to its official NASA mission reference page via **Explore Official NASA Mission ↗** so learners can continue researching primary sources.

---

## NASA Data Sources

- **Apollo 15 Lunar Roving Vehicle (1971-063C):** [https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C)
- **Apollo 12 ALSEP (1969-099C):** [https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C)
- **Mars Exploration Rovers (Spirit & Opportunity):** [https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/)
- **Ingenuity Mars Helicopter:** [https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/)
- **Pioneer 10:** [https://science.nasa.gov/mission/pioneer-10/](https://science.nasa.gov/mission/pioneer-10/)
- **Kepler Space Telescope:** [https://science.nasa.gov/mission/kepler/](https://science.nasa.gov/mission/kepler/)

---

## Technical Architecture

- **Frontend Framework:** React 18 + TypeScript 5 (`strict` mode) + Vite 5
- **Styling & Motion:** Tailwind CSS 3 + Framer Motion (`MotionConfig reducedMotion="user"`)
- **Canvas & Graphics:** HiDPI (`devicePixelRatio`) `<canvas>` rendering with high-quality image smoothing (`src/components/minigames/spriteLoader.ts`) and flat-vector SVG schematics
- **Audio & Accessibility:** Native Web Audio API synthesizer (`src/utils/soundEffects.ts`) and Web Speech API story narration (`src/components/VoiceNarrator.tsx`)
- **Persistence:** Client-side `localStorage` (`abandoned_not_forgotten_save_v1`) for discovered hardware, story/blueprint/quiz/mini-game completion, Cosmic Coins, Explorer Callsign, unlocked avatars/frames, and sound mute preference

---

## AI Usage Disclosure

> Generative AI tools were used to assist in the development of Mission Echo, including source code, user interface components, game mechanics, illustrations, backgrounds, and visual assets. The 00Tea-Minus team selected, integrated, tested, and reviewed the final project components. AI-assisted code and visual content were used to create an interactive educational experience based on real NASA missions. AI-generated illustrations are educational representations and should not be confused with authentic NASA photographs or official NASA technical documentation. Scientific information is based on referenced NASA mission resources. Mission Echo is an independent educational project and is not affiliated with or endorsed by NASA.

---

## Scientific Accuracy & Educational Simulations

All 6 missions reflect verified historical mission parameters—including LRV-1's origami deployment, wire-mesh wheels, `~27.9 km` traverse, and `1/6th` Moon gravity; ALSEP's `SNAP-27` RTG (`~73 W` initial power declining over `~8 years`); Spirit & Opportunity's airbag landing and `45.16 km` Mars marathon; Ingenuity's `~2,537 RPM` coaxial rotors in `~1%` Earth air density (`72` flights vs. `5` planned); Pioneer 10's Jupiter gravity assist, final signal (`Jan 23, 2003`), and trajectory toward Aldebaran; and Kepler's **Transit Method** (`2,600+` confirmed exoplanets, retired `2018`). Interactive mini-games and the Light-Speed Ping (`~300,000 km/s`) are explicitly labeled **Educational Simulation – Simplified Model**, and AI-generated visuals are labeled **AI GENERATED ILLUSTRATION** separately from authentic NASA media.

---

## NASA Media Attribution

> This educational project uses scientific information, imagery, and mission resources from NASA Science, NASA NSSDCA, JPL-Caltech, and NASA Ames Research Center. Authentic NASA photographs, official artist concepts, and educational simulations are identified separately. Users can access official NASA mission resources through links provided throughout the platform.

---

## How to Run Locally

Requires [Node.js 18+](https://nodejs.org/) (LTS recommended).

```bash
npm install
npm run dev      # Start local dev server at http://localhost:5173
npm run build    # Type-check (tsc --noEmit) and build for production
```

---

## Credits

- **Team:** **00Tea-Minus**
- **Creators:** `@talatt` & `@micir`
- **Tester:** Nazlı Aydın
- **Special Thanks:** Vedat Aydın
