<div align="center">

# MISSION ECHO
### Abandoned but Not Forgotten — by `00Tea-Minus`

**An interactive NASA space-hardware museum and engineering playground where missions end, but discoveries live on.**

![React](https://img.shields.io/badge/React-18-141A29?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-141A29?style=for-the-badge&logo=typescript&logoColor=3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-141A29?style=for-the-badge&logo=tailwind-css&logoColor=38BDF8)
![Vite](https://img.shields.io/badge/Vite-5-141A29?style=for-the-badge&logo=vite&logoColor=646CFF)
![NASA Sources](https://img.shields.io/badge/Science-NASA_Sources-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)

*Explore six historic NASA missions across the **Moon**, **Mars**, and **Deep Space** through archival material, narrated stories, engineering challenges, light-speed communication experiments, and six original mini-games.*

### 🚀 [Play the Live Demo](https://abandoned-but-not-forgotten-00-tea.vercel.app/)

*Runs in your browser. No installation or account required.*

</div>

---

## About the Challenge

Created for the **2026 NASA International Space Apps Challenge** (*The Next Frontier*) in response to:

> **Abandoned but Not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars**

NASA spacecraft and scientific instruments have explored the Moon, Mars, and deep space for decades. Some have completed their missions, stopped communicating, or been left at their destinations. Their discoveries, however, still matter.

**Mission Echo** turns six such mission stories into an interactive learning experience. Instead of only reading facts, children can explore each spacecraft, see authentic NASA media, investigate engineering decisions, try simplified simulations, and follow links to original scientific resources.

**Our idea:** A mission can end without its story being forgotten.

## Who Is It For?

Our **primary audience is children aged 10–12**. The platform combines storytelling, visual exploration, and hands-on activities for learners who are ready to connect a mission's history with the engineering behind it.

Different parts of the experience can also appeal to other learners:

| Audience | Main entry point | Learning experience |
| --- | --- | --- |
| **Ages 8–10** | Visual exploration and mini-games | Discover spacecraft through images, animation, and approachable interactions. |
| **Ages 10–12 — primary audience** | Mission stories, games, quizzes, and engineering labs | Learn the history, purpose, and technical challenges of each mission. |
| **Ages 12+** | Technical details and official NASA links | Explore more detailed mission facts and continue researching from primary sources. |

These are **design intentions**, not claims of measured learning outcomes. Teachers and parents can use the browser-based platform as a guided activity without setting up accounts.

## Why These Six Machines?

We selected missions from **three exploration regions** and with different engineering constraints:

- **Moon:** A battery-powered lunar rover and a science station powered by a radioisotope thermoelectric generator (RTG).
- **Mars:** Solar-powered rovers and a small helicopter designed for an extremely thin atmosphere.
- **Deep Space:** A probe that flew past Jupiter and a space telescope that studied distant planets through changes in starlight.

Together, these missions help users explore mobility, scientific instruments, power systems, communications, flight, and planetary discovery.

---

## Features

- **Interactive Solar System Map:** Explore the **Moon**, **Mars**, and **Deep Space**, with additional informational tooltips for other planets.
- **Four-Chapter Mission Stories and Voice Mode:** Mission narratives with authentic archival media, contextual explanations, and browser-based narration using the **Web Speech API**.
- **Media-Type Labels:** NASA archive material is distinguished using labels such as `REAL NASA PHOTO`, `REAL NASA VIDEO`, `NASA SIMULATION`, and `NASA ARTIST CONCEPT`. AI-assisted illustrations must be distinguished from authentic NASA material (see **AI Usage & Transparency**).
- **Blueprint and Environmental Test Chamber:** Inspect spacecraft components, assemble equipment using suitable parts, and observe simplified visual failure scenarios involving cold, atmospheric conditions, or power loss.
- **Light-Speed Communication Simulator:** Send a simulated radio signal from Earth and observe representative one-way signal travel times using the speed of light (approximately **299,792 km/s**). Distances and delays are illustrative, not live mission telemetry.
- **Six Educational Mini-Games:** One interactive activity for each featured spacecraft or mission group.
- **Quizzes, Cosmic Coins, and Avatar Customization:** Complete learning activities, earn in-app coins (**50** for a first clear; **25** for a replay), choose a callsign, and unlock cosmetic items.
- **Mission-Control Sound Effects:** Browser-generated sounds using the **Web Audio API**, with a mute control.
- **Official NASA Source Links:** Follow mission-page links from the experience to learn more from primary sources.

## Missions & Mini-Games (`2 + 2 + 2`)

| Destination | Hardware | Power source | Activity |
| --- | --- | --- | --- |
| **Moon** | **Apollo 15 LRV-1 (Moon Buggy)** | Battery | **Origami Unfold & Lunar Drive:** Deploy the rover, steer across a stylized lunar landscape, avoid hazards, and collect five rock samples. |
| **Moon** | **Apollo 12 ALSEP** | SNAP-27 RTG | **Power & Cable Routing:** Arrange cable tiles to connect the central station with scientific instruments. |
| **Mars** | **Spirit & Opportunity** | Solar panels | **Bounce Landing & Mars Photo Explorer:** Experience a simplified airbag landing, drive across terrain, and photograph geological features associated with evidence of ancient water. |
| **Mars** | **Ingenuity Mars Helicopter** | Solar-charged Li-ion battery | **Super-Spin & Mars Scout Flight:** Spin up the rotors with the mouse wheel, explore the challenge of flight in Mars's thin atmosphere, photograph Perseverance, and land. |
| **Deep Space** | **Pioneer 10** | SNAP-19 RTG | **Jupiter Gravity Flyby:** Adjust launch angle and speed in a simplified trajectory around Jupiter and continue toward deep space. |
| **Deep Space** | **Kepler Space Telescope** | Solar array | **Exoplanet Explorer:** Scan a stylized starfield and investigate brightness dips associated with the **transit method**, using well-known Kepler discoveries as examples. |

> **Scientific note:** These are educational game models, **not** high-fidelity NASA simulators. Visuals, distances, control schemes, and physical responses may be simplified to support learning. In particular, Kepler discovered exoplanet candidates primarily by measuring stellar brightness changes; it did **not** take direct photographs of those planets.

---

## How We Use NASA Data

NASA resources are central to the mission stories and technical explanations—not merely decorative images.

1. **Mission history and specifications:** Mission identities, dates, spacecraft functions, power systems, scientific objectives, and mission outcomes are researched using NASA's mission pages and the **NASA Space Science Data Coordinated Archive (NSSDCA)**.
2. **Archival media:** Authentic NASA photos, videos, and official artist concepts help illustrate the missions. Media types are identified in the interface, and users can open official NASA mission resources.
3. **Engineering scenarios:** The games and environmental test chamber use NASA mission information as the starting point for simplified, interactive engineering lessons.
4. **Physical quantities:** The communications simulator uses the speed of light; other activities incorporate mission-related values where appropriate. Their game implementations remain simplified educational representations.

### NASA Mission Sources

| Featured mission | Official source | Used for |
| --- | --- | --- |
| Apollo 15 Lunar Roving Vehicle | [NASA NSSDCA — Apollo 15 LM/ALSEP (1971-063C)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C); [NASA — Apollo 15 LRV Performance](https://www.nasa.gov/wp-content/uploads/static/history/alsj/WOTM/WOTM-LRVPerformance.html) | The NSSDCA entry covers the **lunar module and ALSEP** and notes that the mission carried the LRV; the rover-specific NASA report supports the LRV's deployment, operation, and engineering background. |
| Apollo 12 ALSEP | [NASA NSSDCA — Apollo 12 LM/ALSEP (1969-099C)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C); [NASA — ALSEP System and Experiments](https://www.nasa.gov/wp-content/uploads/static/history/alsj/HamishALSEP.html) | The NSSDCA entry covers the **lunar module and ALSEP** together; NASA's ALSEP documentation supports the instrument array, central station, cabling, and SNAP-27 RTG power-system background. |
| Spirit & Opportunity | [NASA Science — Mars Exploration Rovers](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/) | Rover objectives, findings, and mission history |
| Ingenuity | [NASA Science — Ingenuity](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/) | Mars helicopter design, flight, and mission context |
| Pioneer 10 | [NASA Science — Pioneer 10](https://science.nasa.gov/mission/pioneer-10/) | Jupiter encounter, spacecraft purpose, and mission history |
| Kepler | [NASA Science — Kepler](https://science.nasa.gov/mission/kepler/) | Exoplanet discoveries and the transit detection method |

**Note on catalog IDs:** `1971-063C` and `1969-099C` are NSSDCA mission-level records for the Apollo 15 and Apollo 12 lunar modules/ALSEP, not standalone records for the rover or ALSEP. Rover- and ALSEP-specific NASA references are listed in the table above.

Media credits: NASA/JPL-Caltech and NASA Ames Research Center are credited where applicable. Individual assets may carry their own credit or usage conditions.

## AI Usage & Transparency

**Generative AI tools assisted the team with:**

- **Source code:** Implementation and refinement of application components, game logic, and interface functionality.
- **Visual design:** Illustrations, character artwork, backgrounds, and other game assets.
- **Development workflow:** Iterating on technical solutions and design ideas.

The **00Tea-Minus team** selected, integrated, reviewed, and tested the resulting work. AI assistance is disclosed rather than represented as entirely manual development.

**AI-generated game illustrations are educational artwork**, not authentic NASA photos, NASA-produced artist concepts, or official engineering drawings. Such illustrations should carry a visible `AI GENERATED` identification in the application. Authentic NASA media should retain its own accurate media-type and source attribution.

AI use in the source code does **not** imply that the platform itself runs a machine-learning model or uses AI to generate answers during gameplay. The app's described games and interfaces run with conventional browser technologies.

## Technical Architecture

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Interface | **React 18** | Component rendering, screens, and user interaction |
| Application logic | **TypeScript 5** | Gameplay rules, mission data, and state handling |
| Visual styling | **Tailwind CSS 3** | Responsive layout and styling |
| Build tooling | **Vite 5** | Local development and production build |
| Game rendering | **HTML5 Canvas 2D** and browser animation APIs | Two-dimensional interactive scenes and animation |
| Narration | **Web Speech API** | Browser-based voice narration |
| Sound | **Web Audio API** | Generated effects and audio feedback |
| Progress | **Browser LocalStorage** | Local game progress and settings |
| Hosting | **Vercel** | Deployment of the web application |

The current experience is primarily **client-side**: no account is required, and progress is stored locally in the user's browser rather than in a shared user database. Clearing browser storage can reset that progress.

## Run Locally

Requires [Node.js 18+](https://nodejs.org/) (LTS recommended).

```bash
npm install
npm run dev
npm run build
```

The development server is normally available at `http://localhost:5173`.

---

## Media Attribution and Usage

This is an **independent educational project**. NASA-derived mission information and media are credited to the relevant NASA source or center when applicable, including **NASA Science**, **NSSDCA**, **JPL-Caltech**, and **NASA Ames Research Center**.

NASA material is used for educational purposes subject to the applicable [NASA media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). **Not every externally hosted image or third-party asset is automatically public domain.** Some NASA pages include material with separate credit or usage conditions.

For further information, see the [NASA Mission Sources](#nasa-mission-sources) table above and the official mission links in the application.

*Mission Echo / 00Tea-Minus is not an official NASA product and is not affiliated with or endorsed by NASA.*

## Credits

- **Creators:** [@talattofc](https://github.com/talattofc) & [@micir](https://github.com/micir2010)
- **Tester:** Nazlı Aydın
- **Special Thanks:** Vedat Aydın

---

<div align="center">

**Mission Echo — Missions end. Discoveries live on.**

**Team `00Tea-Minus` · NASA Space Apps Challenge 2026**

</div>
