import type { DestinationId } from './destinationsData';

export type HardwareId =
  | 'lrv-1'
  | 'apollo-12-alsep'
  | 'spirit-opportunity'
  | 'ingenuity'
  | 'pioneer-10'
  | 'kepler';

export type PowerSource = 'Battery' | 'Solar Panels' | 'Nuclear RTG';

export type StoryIconKey = 'launch' | 'mission' | 'discovery' | 'legacy';

export type StoryMediaBadge =
  | 'REAL NASA PHOTO'
  | 'REAL NASA VIDEO'
  | 'NASA ANIMATION'
  | 'NASA SIMULATION'
  | 'NASA ARTIST CONCEPT';

export interface StoryChapter {
  step: number;
  label: string;
  title: string;
  text: string;
  icon: StoryIconKey;
  chapterImage: string;
  mediaType: 'image' | 'video';
  mediaBadge: StoryMediaBadge;
  mediaCaption: string;
  seismographOverlay?: boolean;
  extraVideoUrl?: string;
  extraVideoLabel?: string;
}

export interface BlueprintHotspot {
  id: string;
  number: 1 | 2 | 3 | 4;
  label: string;
  image: string;
  /** Position in 0..100% of the blueprint frame */
  x: number;
  y: number;
  fact: string;
}

export type FailureCategory = 'freeze' | 'no-oxygen' | 'instability' | 'blackout';

export interface BlueprintOption {
  id: string;
  label: string;
  image: string;
  isCorrect: boolean;
  failureCategory?: FailureCategory;
  failureReason?: string;
}

export interface BlueprintSlot {
  id: string;
  slotName: string;
  /** Visual position on the disassembled schematic (0..100%) */
  x: number;
  y: number;
  options: BlueprintOption[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface HardwareItem {
  id: HardwareId;
  destinationId: DestinationId;
  name: string;
  shortName: string;
  heroImage: string;
  launchYear: string;
  powerSource: PowerSource;
  destinationLabel: string;
  status: string;
  tagline: string;
  sourceUrl: string;
  story: StoryChapter[];
  hotspots: BlueprintHotspot[];
  blueprintSlots: BlueprintSlot[];
  ping: {
    realTimeLabel: string;
    distanceLabel: string;
    simDurationMs: number;
    isFastForward: boolean;
    resultNote: string;
  };
  miniGame: {
    title: string;
    subtitle: string;
    instructions: string;
    controlsHint: string;
  };
  quiz: QuizQuestion[];
}

export const hardwareItems: HardwareItem[] = [
  /* ===================== STOP 1: THE MOON ===================== */
  {
    id: 'lrv-1',
    destinationId: 'moon',
    name: 'Apollo 15 Lunar Roving Vehicle (LRV-1)',
    shortName: 'LRV-1 "Moon Buggy"',
    heroImage: '/nasa/moon/Roving Vehicle/NASA_apollo_lunar_roving_vehicle.png',
    launchYear: '1971',
    powerSource: 'Battery',
    destinationLabel: 'The Moon (Hadley-Apennine)',
    status: 'Mission Complete & Resting',
    tagline: 'The first electric car ever driven on the Moon—folded up like origami for the ride!',
    sourceUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C',
    story: [
      {
        step: 1,
        label: '1. Launch',
        title: 'Packing the Origami Car',
        text: 'Picture trying to pack a full-sized electric car inside a spacecraft! In a spotless NASA cleanroom, engineers hinged LRV-1’s aluminum frame and wire-mesh wheels so it folded flat like origami against the side of the Apollo 15 Lunar Module for the trip to the Moon.',
        icon: 'launch',
        chapterImage: '/story/moon/Apollo 15 Lunar Roving Vehicle (LRV-1)/7020219~large.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'NASA engineers inspecting the folded Lunar Roving Vehicle in the cleanroom before launch.',
      },
      {
        step: 2,
        label: '2. The Mission',
        title: 'Unfolding on the Moon',
        text: 'Once Apollo 15 touched down at Hadley-Apennine in July 1971, real NASA footage captured the astronauts pulling deployment lanyards to unfold and lower LRV-1 onto the powdery lunar dust. Minutes later, the first electric car on the Moon was ready to roll!',
        icon: 'mission',
        chapterImage: '/story/moon/Apollo 15 Lunar Roving Vehicle (LRV-1)/Apollo_15_Lunar_Roving_Vehicle_deployment.webm',
        mediaType: 'video',
        mediaBadge: 'REAL NASA VIDEO',
        mediaCaption: 'Apollo 15 astronauts deploying the folded LRV-1 from the Lunar Module at Hadley-Apennine.',
      },
      {
        step: 3,
        label: '3. Amazing Discovery',
        title: 'Exploring Farther Than Ever',
        text: 'Driving miles away from the Falcon lander let astronauts explore deep craters and collect ancient lunar rocks—including the ~4.1-billion-year-old Genesis Rock—to unlock the Moon’s fiery origin!',
        icon: 'discovery',
        chapterImage:
          '/story/moon/Apollo 15 Lunar Roving Vehicle (LRV-1)/apollo15_lrv_moon.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Apollo 15 rover parked beside lunar craters and mountains during geological exploration.',
      },
      {
        step: 4,
        label: '4. Abandoned, Not Forgotten',
        title: 'Parked Forever at Hadley-Apennine',
        text: 'After covering 27.9 kilometers across mountains and valleys, astronauts parked LRV-1 a safe distance from their lander with its gold umbrella dish pointed back toward Earth. Flight controllers steered its TV camera live to film liftoff—and it still rests there today.',
        icon: 'legacy',
        chapterImage: '/story/moon/Apollo 15 Lunar Roving Vehicle (LRV-1)/Apollo_15_Lunar_Rover_final_resting_place.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Final resting place of LRV-1 on the Moon with its high-gain dish aimed toward Earth.',
      },
    ],
    hotspots: [
      {
        id: 'lrv-wheels',
        number: 1,
        label: 'Wire-Mesh Titanium Wheels',
        image: '/nasa/moon/Roving Vehicle/apollo_rover_5_separate_assets/01_lunar_wire_mesh_wheel.png',
        x: 26,
        y: 74,
        fact: 'Woven from springy piano wire with titanium chevron treads—no air inside, so they could never go flat in freezing lunar dust!',
      },
      {
        id: 'lrv-tbar',
        number: 2,
        label: 'T-Bar Hand Controller',
        image: '/nasa/moon/Roving Vehicle/apollo_rover_5_separate_assets/02_t_bar_hand_controller.png',
        x: 50,
        y: 52,
        fact: 'Instead of a steering wheel and gas pedals (impossible in bulky spacesuits), one T-shaped joystick handled steering, speed, and braking.',
      },
      {
        id: 'lrv-dish',
        number: 3,
        label: 'High-Gain Umbrella Dish',
        image: '/nasa/moon/Roving Vehicle/apollo_rover_5_separate_assets/03_high_gain_dish_antenna.png',
        x: 74,
        y: 26,
        fact: 'This foldable gold-mesh dish beamed live color TV video and astronaut voices straight back to Earth from the Moon.',
      },
      {
        id: 'lrv-seats',
        number: 4,
        label: 'Fold-Out Lunar Seats',
        image: '/nasa/moon/Roving Vehicle/apollo_rover_5_separate_assets/04_fold_out_lunar_seat.png',
        x: 42,
        y: 42,
        fact: 'The whole 210 kg rover weighed only 35 kg in lunar gravity—light enough for two astronauts to lift if it ever got stuck!',
      },
    ],
    blueprintSlots: [
      {
        id: 'lrv-slot-wheels',
        slotName: 'Wheels & Traction',
        x: 24,
        y: 72,
        options: [
          {
            id: 'wire-mesh',
            label: 'Wire-Mesh Titanium Wheels',
            image: '/nasa/moon/Roving Vehicle/apollo_rover_5_separate_assets/01_lunar_wire_mesh_wheel.png',
            isCorrect: true,
          },
          {
            id: 'rubber-tires',
            label: 'Standard Rubber Car Tire',
            image: '/nasa/moon/Roving Vehicle/earth_style_lrv_wrong_parts_6_png/01_standard_rubber_tire.png',
            isCorrect: false,
            failureCategory: 'freeze',
            failureReason: 'Rubber freezes brittle in -170°C lunar shade and air-filled tires burst in the vacuum of space!',
          },
          {
            id: 'tank-treads',
            label: 'Tank Caterpillar Treads',
            image: '/nasa/moon/Roving Vehicle/earth_style_lrv_wrong_parts_6_png/02_tank_caterpillar_treads.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'Heavy steel caterpillar treads exceed the rocket payload limit and jam in fine electrostatic Moon dust!',
          },
        ],
      },
      {
        id: 'lrv-slot-frame',
        slotName: 'Chassis & Controls',
        x: 50,
        y: 50,
        options: [
          {
            id: 'truck-chassis',
            label: 'Heavy Truck Chassis',
            image: '/nasa/moon/Roving Vehicle/earth_style_lrv_wrong_parts_6_png/03_heavy_truck_chassis.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'A rigid heavy truck frame cannot fold inside the Lunar Module and is far too heavy for the rocket!',
          },
          {
            id: 'tbar-controller',
            label: 'T-Bar Hand Controller',
            image: '/nasa/moon/Roving Vehicle/apollo_rover_5_separate_assets/02_t_bar_hand_controller.png',
            isCorrect: true,
          },
          {
            id: 'steering-pedals',
            label: 'Steering Wheel & Pedals',
            image: '/nasa/moon/Roving Vehicle/earth_style_lrv_wrong_parts_6_png/04_steering_wheel_and_pedals.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'Astronauts in pressurized spacesuits cannot bend their ankles to use foot pedals—they need a T-bar joystick!',
          },
        ],
      },
      {
        id: 'lrv-slot-power',
        slotName: 'Power & Propulsion',
        x: 76,
        y: 34,
        options: [
          {
            id: 'gas-engine',
            label: 'Gasoline V8 Engine',
            image: '/nasa/moon/Roving Vehicle/earth_style_lrv_wrong_parts_6_png/05_gasoline_v8_engine.png',
            isCorrect: false,
            failureCategory: 'no-oxygen',
            failureReason: 'Gasoline engines need oxygen from air to burn fuel—there is zero air on the Moon!',
          },
          {
            id: 'sailboat-sail',
            label: 'Wind Sailboat Sail',
            image: '/nasa/moon/Roving Vehicle/earth_style_lrv_wrong_parts_6_png/06_sailboat_sail.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'The Moon is a vacuum with zero wind to push a sail!',
          },
          {
            id: 'silver-zinc',
            label: 'Silver-Zinc Battery Pack',
            image: '/nasa/moon/Roving Vehicle/apollo_rover_5_separate_assets/05_silver_zinc_battery.png',
            isCorrect: true,
          },
        ],
      },
    ],
    ping: {
      realTimeLabel: '~1.28 seconds',
      distanceLabel: '384,400 km away',
      simDurationMs: 1280,
      isFastForward: false,
      resultNote: 'Signal reached Hadley-Apennine in 1.28 seconds! LRV-1’s batteries are long drained, so it stays parked in silence.',
    },
    miniGame: {
      title: 'Origami Unfold & Lunar Drive',
      subtitle: 'Unfold the Moon Buggy, dodge craters, and collect lunar rocks',
      instructions:
        'First, drag the deployment lanyard to unfold LRV-1 like origami from the Lunar Module! Then steer across the Hadley-Apennine valley, dodge craters (or mash Space/Escape if you get stuck), and collect 5 lunar rock samples.',
      controlsHint: 'Drag slider to unfold • Left/Right (or A/D) to steer • Space / Tap to escape craters',
    },
    quiz: [
      {
        question: 'Why did LRV-1 use woven wire-mesh wheels instead of rubber tires?',
        options: [
          'Rubber tires would freeze, crack, and burst in the Moon’s extreme temperatures',
          'Wire-mesh wheels could float on water',
          'Astronauts forgot to pack a tire pump',
        ],
        correctIndex: 0,
        explanation: 'Without an atmosphere, the Moon swings from boiling hot to freezing cold—woven piano wire handled it without needing air.',
      },
      {
        question: 'About how far did Apollo 15 astronauts drive LRV-1 on the Moon?',
        options: ['1.5 kilometers', '27.9 kilometers', '500 kilometers'],
        correctIndex: 1,
        explanation: 'Apollo 15 drove roughly 27.9 km across the Hadley-Apennine region, gathering 77 kg of lunar rocks.',
      },
      {
        question: 'How did LRV-1 fit inside the Apollo Lunar Module?',
        options: [
          'It was built on the Moon from loose rocks',
          'It was towed behind the rocket on a rope',
          'Its frame folded up tightly like origami',
        ],
        correctIndex: 2,
        explanation: 'Engineers hinged the chassis and wheels so LRV-1 folded flat against the side of the Lunar Module.',
      },
    ],
  },

  {
    id: 'apollo-12-alsep',
    destinationId: 'moon',
    name: 'Apollo 12 ALSEP Science Station',
    shortName: 'Apollo 12 ALSEP',
    heroImage: '/nasa/moon/NASA Apollo 12 ALSEP/NASA Apollo 12 ALSEP.png',
    launchYear: '1969',
    powerSource: 'Nuclear RTG',
    destinationLabel: 'The Moon (Ocean of Storms)',
    status: 'Science Station Retired',
    tagline: 'A nuclear-powered Moon lab that kept sending data back to Earth for nearly 8 years!',
    sourceUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C',
    story: [
      {
        step: 1,
        label: '1. Launch',
        title: 'Leaving Behind a Robot Science Outpost',
        text: 'When Apollo 12 astronauts Pete Conrad and Alan Bean landed in the Ocean of Storms in November 1969, they only stayed for 31 hours. Before leaving, they unpacked ALSEP—a robotic science camp built to keep working on the Moon long after their rocket roared home.',
        icon: 'launch',
        chapterImage: '/story/moon/Apollo 12 ALSEP Science Station/1280px-Alan_Bean_deploys_ALSEP_during_first_Apollo_12_EVA_on_moon.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Astronaut Alan Bean removing the SNAP-27 plutonium fuel cask to power the ALSEP station.',
      },
      {
        step: 2,
        label: '2. The Mission',
        title: 'Surviving 14-Day Freezing Lunar Nights',
        text: 'On the Moon, nighttime lasts two whole Earth weeks and plunges below minus 170°C! Solar panels would go completely dark and freeze. So ALSEP carried a finned SNAP-27 nuclear battery (RTG) that produced ~73 watts of initial power from plutonium heat—gradually decreasing over its ~8 years of operation day and night.',
        icon: 'mission',
        chapterImage: '/story/moon/Apollo 12 ALSEP Science Station/AS12-47-6921HR.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Apollo 12 ALSEP Central Station and connected science instruments deployed in the Ocean of Storms.',
      },
      {
        step: 3,
        label: '3. Amazing Discovery',
        title: 'Listening to Secret Moonquakes',
        text: 'Everyone thought the Moon was a silent, dead rock—until ALSEP’s super-sensitive seismometer started listening! It detected thousands of "moonquakes" triggered by Earth’s gravity tugging on the Moon and meteorite impacts, while its magnetometer and solar-wind sensors studied space weather.',
        icon: 'discovery',
        chapterImage: '/story/moon/Apollo 12 ALSEP Science Station/1000w_q95.webp',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Passive Seismic Experiment deployed on lunar soil, overlaid with a live seismic telemetry trace.',
        seismographOverlay: true,
      },
      {
        step: 4,
        label: '4. Abandoned, Not Forgotten',
        title: 'Eight Years of Nonstop Science',
        text: 'Built to last just one year, Apollo 12’s ALSEP kept beaming back discoveries for nearly eight years until NASA shut down the Earth receivers in 1977. Today, the station still stands quietly in the Ocean of Storms.',
        icon: 'legacy',
        chapterImage: '/story/moon/Apollo 12 ALSEP Science Station/AS12-47-6921HR.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Apollo 12 ALSEP instruments resting permanently in the Ocean of Storms after eight years of data.',
      },
    ],
    hotspots: [
      {
        id: 'alsep-rtg',
        number: 1,
        label: 'SNAP-27 Nuclear RTG Cask',
        image: '/nasa/moon/NASA Apollo 12 ALSEP/apollo12_alsep_4_assets_transparent_png/01_snap27_nuclear_rtg.png',
        x: 22,
        y: 64,
        fact: 'This finned cylinder had zero moving parts—it converted heat from decaying plutonium-238 into ~73 W of initial power, gradually decreasing over ~8 years.',
      },
      {
        id: 'alsep-central',
        number: 2,
        label: 'Central Station & Helical Antenna',
        image: '/nasa/moon/NASA Apollo 12 ALSEP/apollo12_alsep_4_assets_transparent_png/02_central_station_helical_antenna.png',
        x: 50,
        y: 42,
        fact: 'Collected measurements from every deployed sensor and beamed them straight to Earth using its corkscrew helical antenna.',
      },
      {
        id: 'alsep-seismometer',
        number: 3,
        label: 'Passive Seismometer Dome',
        image: '/nasa/moon/NASA Apollo 12 ALSEP/apollo12_alsep_4_assets_transparent_png/03_passive_seismometer_dome.png',
        x: 76,
        y: 66,
        fact: 'Wrapped in a thermal blanket dome, it could feel ground vibrations smaller than the width of a single hydrogen atom!',
      },
      {
        id: 'alsep-mag',
        number: 4,
        label: 'Lunar Surface Magnetometer',
        image: '/nasa/moon/NASA Apollo 12 ALSEP/apollo12_alsep_4_assets_transparent_png/04_lunar_surface_magnetometer.png',
        x: 84,
        y: 42,
        fact: 'Three sensor arms measured tiny magnetic fields across the lunar surface to help map the Moon’s deep interior.',
      },
    ],
    blueprintSlots: [
      {
        id: 'alsep-slot-power',
        slotName: 'Power Generator',
        x: 22,
        y: 66,
        options: [
          {
            id: 'snap-27',
            label: 'SNAP-27 Nuclear RTG',
            image: '/nasa/moon/NASA Apollo 12 ALSEP/apollo12_alsep_4_assets_transparent_png/01_snap27_nuclear_rtg.png',
            isCorrect: true,
          },
          {
            id: 'folding-solar',
            label: 'Folding Solar Panel',
            image: '/nasa/moon/NASA Apollo 12 ALSEP/alsep_earth_decoy_6_transparent_pngs/01_folding_solar_panel.png',
            isCorrect: false,
            failureCategory: 'blackout',
            failureReason: 'During the 14-day lunar night, solar panels get zero sunlight and the station freezes solid!',
          },
          {
            id: 'alkaline-pack',
            label: 'AA Alkaline Batteries',
            image: '/nasa/moon/NASA Apollo 12 ALSEP/alsep_earth_decoy_6_transparent_pngs/02_aa_alkaline_batteries.png',
            isCorrect: false,
            failureCategory: 'freeze',
            failureReason: 'AA batteries freeze at -170°C and die in days instead of powering experiments for nearly 8 years!',
          },
        ],
      },
      {
        id: 'alsep-slot-comms',
        slotName: 'Data & Antenna Hub',
        x: 50,
        y: 44,
        options: [
          {
            id: 'wifi-router',
            label: 'Home Wi-Fi Router',
            image: '/nasa/moon/NASA Apollo 12 ALSEP/alsep_earth_decoy_6_transparent_pngs/03_home_wifi_router.png',
            isCorrect: false,
            failureCategory: 'blackout',
            failureReason: 'A home Wi-Fi router only reaches across a house—not 384,400 km back to Earth!',
          },
          {
            id: 'helical-hub',
            label: 'Central Station + Helical Antenna',
            image: '/nasa/moon/NASA Apollo 12 ALSEP/apollo12_alsep_4_assets_transparent_png/02_central_station_helical_antenna.png',
            isCorrect: true,
          },
          {
            id: 'usb-drive',
            label: 'USB Flash Drive',
            image: '/nasa/moon/NASA Apollo 12 ALSEP/alsep_earth_decoy_6_transparent_pngs/04_usb_flash_drive.png',
            isCorrect: false,
            failureCategory: 'blackout',
            failureReason: 'No astronauts were coming back to pick up a USB stick—ALSEP had to radio data live to Earth!',
          },
        ],
      },
      {
        id: 'alsep-slot-sensor',
        slotName: 'Moonquake Sensor',
        x: 78,
        y: 66,
        options: [
          {
            id: 'weather-vane',
            label: 'Rooster Weather Vane',
            image: '/nasa/moon/NASA Apollo 12 ALSEP/alsep_earth_decoy_6_transparent_pngs/05_rooster_weather_vane.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'There is no wind on the Moon to spin a weather vane, and it cannot measure moonquakes!',
          },
          {
            id: 'studio-mic',
            label: 'Studio Sound Microphone',
            image: '/nasa/moon/NASA Apollo 12 ALSEP/alsep_earth_decoy_6_transparent_pngs/06_studio_microphone.png',
            isCorrect: false,
            failureCategory: 'freeze',
            failureReason: 'Sound waves cannot travel through the Moon’s airless vacuum—you need a ground-coupled seismometer!',
          },
          {
            id: 'seismometer-dome',
            label: 'Passive Seismometer Dome',
            image: '/nasa/moon/NASA Apollo 12 ALSEP/apollo12_alsep_4_assets_transparent_png/03_passive_seismometer_dome.png',
            isCorrect: true,
          },
        ],
      },
    ],
    ping: {
      realTimeLabel: '~1.28 seconds',
      distanceLabel: '384,400 km away',
      simDurationMs: 1280,
      isFastForward: false,
      resultNote: 'Signal reached the Ocean of Storms in 1.28 seconds! ALSEP’s radio transmitter was shut down in 1977.',
    },
    miniGame: {
      title: 'ALSEP Power & Cable Routing',
      subtitle: 'Connect the nuclear battery to the science station',
      instructions:
        'Slide and rotate the cable tiles across the lunar grid to route power from the SNAP-27 Nuclear RTG through the Central Station to both the Seismometer and Magnetometer—avoiding lunar boulders!',
      controlsHint: 'Click a tile next to an empty slot to slide • Click/Tap tile to rotate 90°',
    },
    quiz: [
      {
        question: 'How did the Apollo 12 ALSEP station stay powered during 14-day-long freezing lunar nights?',
        options: [
          'A giant wind turbine',
          'A SNAP-27 nuclear RTG generator',
          'Extension cords from Earth',
        ],
        correctIndex: 1,
        explanation: 'The SNAP-27 Radioisotope Thermoelectric Generator used steady nuclear heat to power ALSEP day and night.',
      },
      {
        question: 'What surprising discovery did ALSEP’s seismometer make about the Moon?',
        options: [
          'The Moon has regular "moonquakes"',
          'The Moon is hollow inside',
          'The Moon has underground oceans of lava whales',
        ],
        correctIndex: 0,
        explanation: 'ALSEP recorded thousands of moonquakes, revealing the Moon has a crust, mantle, and small core.',
      },
      {
        question: 'How long did Apollo 12’s ALSEP keep sending data back to Earth?',
        options: ['Only 2 days', 'Nearly 8 years (until 1977)', '6 months'],
        correctIndex: 1,
        explanation: 'Designed for 1 year, it worked reliably from 1969 until NASA retired the ALSEP network in September 1977.',
      },
    ],
  },

  /* ===================== STOP 2: MARS ===================== */
  {
    id: 'spirit-opportunity',
    destinationId: 'mars',
    name: 'Spirit & Opportunity Rovers',
    shortName: 'Spirit & Opportunity',
    heroImage: '/nasa/mars/Spirit & Opportunity Rovers/NASA Spirit and Opportunity Mars Exploration Rover.png',
    launchYear: '2003',
    powerSource: 'Solar Panels',
    destinationLabel: 'Mars (Gusev & Meridiani)',
    status: 'Mission Complete & Resting',
    tagline: 'Twin 90-day rovers that lasted up to 15 years—and ran the first marathon on another planet!',
    sourceUrl: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/',
    story: [
      {
        step: 1,
        label: '1. Launch',
        title: 'Bouncing Onto Mars in Giant Airbags',
        text: 'In 2003, NASA launched twin robot geologists—Spirit and Opportunity—to opposite sides of Mars. Instead of gently landing on legs, each rover tucked inside a cocoon of giant airbags and bounced dozens of times across the Martian dirt until it rolled to a stop!',
        icon: 'launch',
        chapterImage: '/story/mars/Spirit & Opportunity Rovers/PIA07216.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Opportunity’s deflated landing airbags and lander petals photographed at Eagle Crater on Mars.',
      },
      {
        step: 2,
        label: '2. The Mission',
        title: 'The 90-Day Robots That Refused to Quit',
        text: 'Scientists expected dust to bury the rovers’ wing-like solar panels in just 90 Martian days. Instead, swirling Martian dust devils swept their panels clean! Spirit explored for over 6 years, and Opportunity kept rolling for nearly 15 years!',
        icon: 'mission',
        chapterImage: '/story/mars/Spirit & Opportunity Rovers/PIA09104.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'A real Martian dust devil caught sweeping across the plains near the Spirit rover in Gusev Crater.',
      },
      {
        step: 3,
        label: '3. Amazing Discovery',
        title: 'Martian "Blueberries" & Ancient Water',
        text: 'Using its robotic arm and eye-level Pancam, Opportunity spotted thousands of tiny round mineral spheres nicknamed "blueberries" made of hematite. Along with wave-rippled rocks, they proved ancient Mars once had liquid water!',
        icon: 'discovery',
        chapterImage: '/story/mars/Spirit & Opportunity Rovers/38388_Mars-Opportunity-blueberries-hematite-Fram-Crater-pia19113.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Microscopic close-up of round hematite "blueberries" embedded in Martian bedrock at Fram Crater.',
      },
      {
        step: 4,
        label: '4. Abandoned, Not Forgotten',
        title: 'Surpassing a Full Marathon on Mars',
        text: 'Opportunity drove 45.16 kilometers in total—surpassing the 42.195 km marathon distance on another planet! This real NASA sky-darkening sequence (Sols 1205–1235) shows how Martian dust storms block sunlight from solar panels. In 2018, an even larger global dust storm drained Opportunity’s batteries for good.',
        icon: 'legacy',
        chapterImage: '/story/mars/Spirit & Opportunity Rovers/PIA09935.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Real Opportunity sky-darkening sequence across Sols 1205–1235 showing dust blocking sunlight.',
      },
    ],
    hotspots: [
      {
        id: 'mer-pancam',
        number: 1,
        label: 'Pancam Masthead',
        image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_4_individual_transparent_pngs/01_pancam_masthead.png',
        x: 54,
        y: 22,
        fact: 'Standing at human eye-level, the Pancam snapped 3D color panoramas using 14 different scientific filters.',
      },
      {
        id: 'mer-solar',
        number: 2,
        label: 'Fold-Out Solar Array Deck',
        image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_4_individual_transparent_pngs/02_fold_out_solar_array_deck.png',
        x: 48,
        y: 50,
        fact: 'Fold-out solar wings powered the rover and got surprise "cleaning boosts" whenever Martian dust devils blew past!',
      },
      {
        id: 'mer-arm',
        number: 3,
        label: 'Robotic Science Arm',
        image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_4_individual_transparent_pngs/03_robotic_science_arm.png',
        x: 78,
        y: 62,
        fact: 'Reached out like a human arm with a rock-grinder and microscope to examine Mars’s hematite "blueberries" up close.',
      },
      {
        id: 'mer-bogie',
        number: 4,
        label: '6-Wheel Rocker-Bogie Suspension',
        image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_4_individual_transparent_pngs/04_six_wheel_rocker_bogie_suspension.png',
        x: 32,
        y: 74,
        fact: 'Six independently driven wheels let the rovers climb over rocks taller than their own wheel diameter without tipping.',
      },
    ],
    blueprintSlots: [
      {
        id: 'mer-slot-wheels',
        slotName: 'Mobility System',
        x: 28,
        y: 74,
        options: [
          {
            id: 'rocker-bogie',
            label: '6-Wheel Rocker-Bogie',
            image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_4_individual_transparent_pngs/04_six_wheel_rocker_bogie_suspension.png',
            isCorrect: true,
          },
          {
            id: 'smooth-wheels',
            label: 'Smooth Rubber Wheels',
            image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_wrong_parts_6_transparent_pngs/01_smooth_rubber_wheels.png',
            isCorrect: false,
            failureCategory: 'freeze',
            failureReason: 'Smooth rubber wheels freeze stiff in Martian cold and sink right into soft Martian sand dunes!',
          },
          {
            id: 'pogo-legs',
            label: 'Spring Pogo Legs',
            image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_wrong_parts_6_transparent_pngs/02_spring_pogo_legs.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'Hopping pogo legs would tip the rover over onto its solar panels on steep crater slopes!',
          },
        ],
      },
      {
        id: 'mer-slot-power',
        slotName: 'Solar Power Deck',
        x: 50,
        y: 50,
        options: [
          {
            id: 'calc-solar',
            label: 'Pocket Calculator Solar Cell',
            image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_wrong_parts_6_transparent_pngs/03_pocket_calculator_solar_cell.png',
            isCorrect: false,
            failureCategory: 'blackout',
            failureReason: 'Mars receives less than half of Earth’s sunlight—a tiny calculator cell cannot power a rover!',
          },
          {
            id: 'solar-wings',
            label: 'Fold-Out Solar Array Deck',
            image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_4_individual_transparent_pngs/02_fold_out_solar_array_deck.png',
            isCorrect: true,
          },
          {
            id: 'wind-turbine',
            label: 'Wind Turbine',
            image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_wrong_parts_6_transparent_pngs/04_wind_turbine.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'Mars’s air is ~1% as thick as Earth’s, so wind carries almost no pushing force to spin a heavy turbine!',
          },
        ],
      },
      {
        id: 'mer-slot-tools',
        slotName: 'Science & Cameras',
        x: 74,
        y: 34,
        options: [
          {
            id: 'backup-cam',
            label: 'Car Backup Camera',
            image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_wrong_parts_6_transparent_pngs/05_backup_camera.png',
            isCorrect: false,
            failureCategory: 'freeze',
            failureReason: 'A standard car backup camera freezes at -90°C and cannot take scientific filtered panoramas!',
          },
          {
            id: 'pancam-mast',
            label: 'Pancam Masthead',
            image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_4_individual_transparent_pngs/01_pancam_masthead.png',
            isCorrect: true,
          },
          {
            id: 'butterfly-net',
            label: 'Butterfly Net',
            image: '/nasa/mars/Spirit & Opportunity Rovers/mars_rover_wrong_parts_6_transparent_pngs/06_butterfly_net.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'A net cannot grind hard volcanic rock or scan microscopic hematite blueberries!',
          },
        ],
      },
    ],
    ping: {
      realTimeLabel: '~12.5 minutes (avg)',
      distanceLabel: '~225 million km (avg)',
      simDurationMs: 3000,
      isFastForward: true,
      resultNote: 'Fast-forward complete! Real signal takes ~12.5 minutes on average—Opportunity went silent after the 2018 global dust storm.',
    },
    miniGame: {
      title: 'Bounce Landing & Mars Photo Explorer',
      subtitle: 'Survive the airbag landing and photograph Martian discoveries',
      instructions:
        "Watch Opportunity bounce safely onto Mars inside its airbag cocoon, then drive across the red desert—steering around steep craters—to snap Pancam photos of hematite 'blueberries' and ancient water rocks!",
      controlsHint: 'WASD / Arrow Keys (or D-Pad) to drive • Space / Tap Camera button to snap photo',
    },
    quiz: [
      {
        question: 'How long were Spirit and Opportunity originally designed to last on Mars?',
        options: ['90 Martian days', '50 years', '1 week'],
        correctIndex: 0,
        explanation: 'They were built for a 90-day prime mission, yet Spirit ran for over 6 years and Opportunity for nearly 15!',
      },
      {
        question: 'What did Opportunity’s mineral "blueberries" help prove about ancient Mars?',
        options: [
          'Mars used to have blueberry farms',
          'Mars once had liquid water on and under its surface',
          'Mars is made of blue cheese',
        ],
        correctIndex: 1,
        explanation: 'The tiny spheres of hematite typically form when mineral-rich water soaks through porous rock.',
      },
      {
        question: 'What finally caused Opportunity to stop calling home in 2018?',
        options: [
          'It ran out of nuclear fuel',
          'A giant planet-wide dust storm blocked sunlight from its solar panels',
          'It drove off Mars into space',
        ],
        correctIndex: 1,
        explanation: 'A massive global dust storm plunged Opportunity into darkness, draining its batteries during the Martian winter.',
      },
    ],
  },

  {
    id: 'ingenuity',
    destinationId: 'mars',
    name: 'Ingenuity Mars Helicopter',
    shortName: 'Ingenuity Helicopter',
    heroImage: '/nasa/mars/Ingenuity Mars Helicopter/NASA Ingenuity Mars Helicopter.png',
    launchYear: '2020',
    powerSource: 'Solar Panels',
    destinationLabel: 'Mars (Jezero Crater)',
    status: 'Grounded After 72 Flights',
    tagline: 'The first aircraft to fly on another planet—soaring 72 times in air 100× thinner than Earth’s!',
    sourceUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/',
    story: [
      {
        step: 1,
        label: '1. Launch',
        title: 'A Secret Stowaway Under Perseverance',
        text: 'In 2020, a tiny 1.8-kilogram helicopter named Ingenuity hitched a ride to Mars folded under the belly of the Perseverance rover. Engineers called it a "Wright brothers moment" on another planet—nobody had ever flown a powered aircraft off Earth before!',
        icon: 'launch',
        chapterImage: '/story/mars/Ingenuity Mars Helicopter/25762_PIA24443-1200.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Ingenuity unfolded on the Martian surface beneath the belly of the Perseverance rover.',
      },
      {
        step: 2,
        label: '2. The Mission',
        title: 'Spinning Blades in 1% Thin Air',
        text: 'Mars’s air is only about 1% as dense as Earth’s—thinner than the air three times higher than Mount Everest! To lift off, Ingenuity’s two coaxial carbon-fiber blades had to spin in opposite directions at a blistering 2,400 revolutions per minute.',
        icon: 'mission',
        chapterImage: '/story/mars/Ingenuity Mars Helicopter/PIA24521.mp4',
        mediaType: 'video',
        mediaBadge: 'REAL NASA VIDEO',
        mediaCaption: 'Perseverance rover video of Ingenuity’s historic first powered flight in Jezero Crater.',
      },
      {
        step: 3,
        label: '3. Amazing Discovery',
        title: 'Five Planned Flights Became 72!',
        text: 'On April 19, 2021, Ingenuity hovered 3 meters above Jezero Crater—making history! Designed for just 5 flights, it worked so brilliantly that NASA promoted it to Perseverance’s official aerial scout, completing an astonishing 72 flights!',
        icon: 'discovery',
        chapterImage: '/story/mars/Ingenuity Mars Helicopter/25868_flt3_nav_vert-cropped.gif',
        mediaType: 'image',
        mediaBadge: 'REAL NASA VIDEO',
        mediaCaption: 'Downward navigation camera footage from Ingenuity’s Flight 3 gliding over Martian sand.',
      },
      {
        step: 4,
        label: '4. Abandoned, Not Forgotten',
        title: 'Resting at Valinor Hills',
        text: 'During Flight 72 in January 2024, smooth sand dunes confused Ingenuity’s navigation camera, and a blade tip snapped on landing. Though grounded at Valinor Hills, it proved humans can fly robotic explorers across alien skies.',
        icon: 'legacy',
        chapterImage: '/story/mars/Ingenuity Mars Helicopter/PIA26243.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Ingenuity photographed resting on the sand dunes of Valinor Hills after its 72nd flight.',
      },
    ],
    hotspots: [
      {
        id: 'ing-solar',
        number: 1,
        label: 'Top Square Solar Panel',
        image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_mars_helicopter_4_separate_pngs/01_solar_panel_lithium_ion.png',
        x: 50,
        y: 14,
        fact: 'Sat above the rotors to soak up Martian sunlight and recharge six lithium-ion batteries for heating and flight.',
      },
      {
        id: 'ing-rotors',
        number: 2,
        label: 'Coaxial Rotor Blades',
        image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_mars_helicopter_4_separate_pngs/02_coaxial_rotor_blades.png',
        x: 50,
        y: 34,
        fact: 'Two 1.2-meter carbon-fiber blades spun in opposite directions at ~2,400 RPM to create lift in Mars’s 1% atmosphere.',
      },
      {
        id: 'ing-fuselage',
        number: 3,
        label: 'Fuselage & Camera',
        image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_mars_helicopter_4_separate_pngs/03_fuselage_camera.png',
        x: 50,
        y: 56,
        fact: 'Packed an autonomous flight computer and downward camera inside an insulated box to survive -90°C Martian nights.',
      },
      {
        id: 'ing-legs',
        number: 4,
        label: 'Carbon-Fiber Landing Legs',
        image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_mars_helicopter_4_separate_pngs/04_carbon_fiber_landing_legs.png',
        x: 34,
        y: 74,
        fact: 'Four springy angled legs absorbed the bump of landing on uneven Martian rocks and dust.',
      },
    ],
    blueprintSlots: [
      {
        id: 'ing-slot-rotors',
        slotName: 'Lift & Rotor Blades',
        x: 50,
        y: 32,
        options: [
          {
            id: 'carbon-coaxial',
            label: 'Coaxial Carbon Blades',
            image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_mars_helicopter_4_separate_pngs/02_coaxial_rotor_blades.png',
            isCorrect: true,
          },
          {
            id: 'toy-blades',
            label: 'Toy Quadcopter Propellers',
            image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_wrong_decoys_6_transparent_pngs/01_toy_quadcopter_propellers.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'Tiny plastic toy propellers spin too slowly and cannot generate lift in Mars’s 1% thin atmosphere!',
          },
          {
            id: 'jet-wings',
            label: 'Short Jet Airplane Wings',
            image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_wrong_decoys_6_transparent_pngs/02_short_jet_airplane_wings.png',
            isCorrect: false,
            failureCategory: 'no-oxygen',
            failureReason: 'There is no runway on Mars and jet engines need Earth-like oxygen to burn fuel!',
          },
        ],
      },
      {
        id: 'ing-slot-power',
        slotName: 'Power & Heating',
        x: 50,
        y: 16,
        options: [
          {
            id: 'aa-batteries',
            label: 'Disposable AA Batteries',
            image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_wrong_decoys_6_transparent_pngs/03_disposable_aa_batteries.png',
            isCorrect: false,
            failureCategory: 'freeze',
            failureReason: 'Freezing -90°C Martian nights drain disposable AA batteries on night one with no way to recharge!',
          },
          {
            id: 'top-solar',
            label: 'Solar Panel + Li-Ion Pack',
            image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_mars_helicopter_4_separate_pngs/01_solar_panel_lithium_ion.png',
            isCorrect: true,
          },
          {
            id: 'tether-cable',
            label: 'Coiled Tether Power Cable',
            image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_wrong_decoys_6_transparent_pngs/04_coiled_tether_power_cable.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'A heavy tether cable tangles on boulders and stops Ingenuity from flying hundreds of meters ahead!',
          },
        ],
      },
      {
        id: 'ing-slot-legs',
        slotName: 'Landing Gear',
        x: 34,
        y: 74,
        options: [
          {
            id: 'carbon-legs',
            label: 'Carbon-Fiber Landing Legs',
            image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_mars_helicopter_4_separate_pngs/04_carbon_fiber_landing_legs.png',
            isCorrect: true,
          },
          {
            id: 'steel-skids',
            label: 'Heavy Steel Landing Skids',
            image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_wrong_decoys_6_transparent_pngs/05_heavy_steel_landing_skids.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'Heavy steel skids push Ingenuity over its 1.8 kg weight limit so it can never lift off!',
          },
          {
            id: 'legless-belly',
            label: 'Legless Helicopter Belly',
            image: '/nasa/mars/Ingenuity Mars Helicopter/ingenuity_wrong_decoys_6_transparent_pngs/06_legless_helicopter_belly.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'Landing directly on the fuselage smashes the downward navigation camera against Martian rocks!',
          },
        ],
      },
    ],
    ping: {
      realTimeLabel: '~12.5 minutes (avg)',
      distanceLabel: '~225 million km (avg)',
      simDurationMs: 3000,
      isFastForward: true,
      resultNote: 'Fast-forward complete! Real signal takes ~12.5 minutes on average—Ingenuity now rests permanently at Valinor Hills.',
    },
    miniGame: {
      title: 'Super-Spin & Mars Scout Flight',
      subtitle: 'Rev rotors to 2,537 RPM and fly above Jezero Crater',
      instructions:
        "Mars's air is only 1% as thick as Earth's! Scroll your mouse wheel rapidly to spin Ingenuity's twin blades past 2,537 RPM for lift-off, fly over Mars to photograph Perseverance, and land gently on the helipad.",
      controlsHint: 'Mouse Wheel (or Spin button) to rev RPM • WASD / Arrows to fly • Space to snap photo',
    },
    quiz: [
      {
        question: 'Why was flying a helicopter on Mars so difficult?',
        options: [
          'Mars’s atmosphere is only about 1% as dense as Earth’s',
          'Mars has no gravity at all',
          'The helicopter was too heavy to fit on a rocket',
        ],
        correctIndex: 0,
        explanation: 'With only ~1% of Earth’s air density, Ingenuity needed ultra-light carbon-fiber blades spinning at ~2,400 RPM.',
      },
      {
        question: 'How many flights did Ingenuity complete on Mars in total?',
        options: ['5 flights', '12 flights', '72 flights'],
        correctIndex: 2,
        explanation: 'Originally planned for up to 5 test flights, Ingenuity soared 72 times between 2021 and 2024!',
      },
      {
        question: 'Why couldn’t engineers on Earth fly Ingenuity with a live joystick?',
        options: [
          'They didn’t have any joysticks at NASA',
          'Radio signals take several minutes to travel between Earth and Mars',
          'Mars blocks all radio waves',
        ],
        correctIndex: 1,
        explanation: 'Because light-speed signals take minutes each way, Ingenuity flew autonomously using its onboard computers.',
      },
    ],
  },

  /* ===================== STOP 3: DEEP SPACE ===================== */
  {
    id: 'pioneer-10',
    destinationId: 'deep-space',
    name: 'Pioneer 10',
    shortName: 'Pioneer 10',
    heroImage: '/nasa/deep space/Pioneer 10/NASA Pioneer 10.png',
    launchYear: '1972',
    powerSource: 'Nuclear RTG',
    destinationLabel: 'Deep Space (Toward Aldebaran)',
    status: 'Drifting in Interstellar Space',
    tagline: 'The trailblazer that braved the asteroid belt, photographed Jupiter, and carries a golden message!',
    sourceUrl: 'https://science.nasa.gov/mission/pioneer-10/',
    story: [
      {
        step: 1,
        label: '1. Launch',
        title: 'Night Liftoff into the Unknown',
        text: 'Blasting off into the night sky on an Atlas-Centaur rocket on March 2, 1972, Pioneer 10 moved so fast that it passed the Moon in just 11 hours—and became the first spacecraft aimed straight for the Asteroid Belt and Jupiter!',
        icon: 'launch',
        chapterImage: '/story/deep space/Pioneer 10/72402main_AC72-2143-1.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Real 1972 night launch of Pioneer 10 atop an Atlas-Centaur rocket from Cape Canaveral.',
        extraVideoUrl: 'https://www.youtube.com/watch?v=tY7-cSU7S0U',
        extraVideoLabel: 'Watch Restored 1972 Launch Film (YouTube) ↗',
      },
      {
        step: 2,
        label: '2. The Mission',
        title: 'First Close-Up of Jupiter',
        text: 'Pioneer 10 survived the Asteroid Belt unscathed and snapped the first close-up images of Jupiter in December 1973—capturing its swirling storm belts, the Great Red Spot, and the dark shadow of its volcanic moon Io!',
        icon: 'mission',
        chapterImage: '/story/deep space/Pioneer 10/2921_AC739175.webp',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Pioneer 10’s real December 1973 close-up of Jupiter showing the Great Red Spot and moon Io’s shadow.',
      },
      {
        step: 3,
        label: '3. Amazing Discovery',
        title: 'The Golden Plaque',
        text: 'Engineers bolted a gleaming gold-anodized aluminum plaque onto Pioneer 10 showing a cosmic pulsar map to Earth and drawings of two humans—a timeless message in a bottle for any civilization among the stars!',
        icon: 'discovery',
        chapterImage:
          '/story/deep space/Pioneer 10/1280px-Pioneer-10_interstellar_plaque_positioned_on_spacecraft_(ARC-1972-A72-2137).jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'The engraved gold-anodized Pioneer Plaque mounted directly onto the spacecraft’s frame.',
      },
      {
        step: 4,
        label: '4. Abandoned, Not Forgotten',
        title: 'Bound for Aldebaran',
        text: 'After Jupiter’s gravity slingshot boosted it out of the solar system, Pioneer 10 sent its final faint 8-watt signal on January 23, 2003, and now glides silently into deep space toward the red giant star Aldebaran.',
        icon: 'legacy',
        chapterImage: '/story/deep space/Pioneer 10/pioneer_10_launch_6_jupiter_flyby_art.webp',
        mediaType: 'image',
        mediaBadge: 'NASA ARTIST CONCEPT',
        mediaCaption: 'Artist concept of Pioneer 10 using Jupiter’s gravity slingshot to coast into interstellar space.',
      },
    ],
    hotspots: [
      {
        id: 'p10-dish',
        number: 1,
        label: '2.74m Parabolic High-Gain Dish',
        image: '/nasa/deep space/Pioneer 10/pioneer10_4_separate_transparent_assets/01_parabolic_high_gain_dish.png',
        x: 50,
        y: 34,
        fact: 'Aimed Pioneer 10’s faint 8-watt radio signal back toward Earth across billions of kilometers of dark space.',
      },
      {
        id: 'p10-rtg',
        number: 2,
        label: 'Twin SNAP-19 RTG Booms',
        image: '/nasa/deep space/Pioneer 10/pioneer10_4_separate_transparent_assets/02_twin_snap19_rtg_booms.png',
        x: 20,
        y: 66,
        fact: 'Four plutonium-238 nuclear generators sat on long booms so their radiation wouldn’t confuse the probe’s science sensors.',
      },
      {
        id: 'p10-mag',
        number: 3,
        label: 'Magnetometer Boom',
        image: '/nasa/deep space/Pioneer 10/pioneer10_4_separate_transparent_assets/03_magnetometer_boom.png',
        x: 50,
        y: 82,
        fact: 'A third long radial boom held a sensitive sensor far away from the spacecraft’s own metal to measure Jupiter’s huge magnetic field.',
      },
      {
        id: 'p10-plaque',
        number: 4,
        label: 'Gold Pioneer Plaque',
        image: '/nasa/deep space/Pioneer 10/pioneer10_4_separate_transparent_assets/04_gold_pioneer_plaque.png',
        x: 60,
        y: 56,
        fact: 'A gold-anodized aluminum postcard showing Earth’s galactic address and two humans—built to last millions of years in space.',
      },
    ],
    blueprintSlots: [
      {
        id: 'p10-slot-power',
        slotName: 'Deep-Space Power',
        x: 22,
        y: 66,
        options: [
          {
            id: 'rtg-booms',
            label: 'Twin SNAP-19 RTG Booms',
            image: '/nasa/deep space/Pioneer 10/pioneer10_4_separate_transparent_assets/02_twin_snap19_rtg_booms.png',
            isCorrect: true,
          },
          {
            id: 'solar-panels',
            label: 'Regular Solar Panels',
            image: '/nasa/deep space/Pioneer 10/pioneer10_wrong_decoy_assets_6_transparent_pngs/01_regular_solar_panels.png',
            isCorrect: false,
            failureCategory: 'blackout',
            failureReason: 'Out past Jupiter and in deep space, sunlight is over 25× dimmer than on Earth—solar input drops to 0.1%!',
          },
          {
            id: 'aa-cells',
            label: 'AA Alkaline Batteries',
            image: '/nasa/deep space/Pioneer 10/pioneer10_wrong_decoy_assets_6_transparent_pngs/02_aa_alkaline_batteries.png',
            isCorrect: false,
            failureCategory: 'freeze',
            failureReason: 'Alkaline batteries freeze and run flat in hours instead of powering Pioneer 10 for over 30 years!',
          },
        ],
      },
      {
        id: 'p10-slot-dish',
        slotName: 'Earth Communications',
        x: 50,
        y: 34,
        options: [
          {
            id: 'car-antenna',
            label: 'Car Radio Antenna',
            image: '/nasa/deep space/Pioneer 10/pioneer10_wrong_decoy_assets_6_transparent_pngs/03_car_radio_antenna.png',
            isCorrect: false,
            failureCategory: 'blackout',
            failureReason: 'A tiny whip antenna scatters radio waves everywhere—Earth would never hear an 8-watt signal from Jupiter!',
          },
          {
            id: 'parabolic-dish',
            label: 'Parabolic High-Gain Dish',
            image: '/nasa/deep space/Pioneer 10/pioneer10_4_separate_transparent_assets/01_parabolic_high_gain_dish.png',
            isCorrect: true,
          },
          {
            id: 'laser-pointer',
            label: 'Pocket Laser Pointer',
            image: '/nasa/deep space/Pioneer 10/pioneer10_wrong_decoy_assets_6_transparent_pngs/04_pocket_laser_pointer.png',
            isCorrect: false,
            failureCategory: 'blackout',
            failureReason: 'A handheld laser pointer cannot transmit radio telemetry over billions of kilometers!',
          },
        ],
      },
      {
        id: 'p10-slot-plaque',
        slotName: 'Message & Sensors',
        x: 74,
        y: 66,
        options: [
          {
            id: 'paper-map',
            label: 'Paper Map in Plastic Bag',
            image: '/nasa/deep space/Pioneer 10/pioneer10_wrong_decoy_assets_6_transparent_pngs/05_paper_map_plastic_bag.png',
            isCorrect: false,
            failureCategory: 'freeze',
            failureReason: 'Space radiation shreds paper and plastic quickly—only engraved gold-anodized aluminum survives millions of years!',
          },
          {
            id: 'taped-sensor',
            label: 'Taped Magnetometer Sensor',
            image: '/nasa/deep space/Pioneer 10/pioneer10_wrong_decoy_assets_6_transparent_pngs/06_taped_magnetometer_sensor.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'Taped onto the spacecraft body, the magnetometer only measures the probe’s own electronics instead of Jupiter’s field!',
          },
          {
            id: 'gold-plaque',
            label: 'Gold Pioneer Plaque',
            image: '/nasa/deep space/Pioneer 10/pioneer10_4_separate_transparent_assets/04_gold_pioneer_plaque.png',
            isCorrect: true,
          },
        ],
      },
    ],
    ping: {
      realTimeLabel: '~19.1 hours',
      distanceLabel: '~20.6 billion km away',
      simDurationMs: 3600,
      isFastForward: true,
      resultNote: 'Fast-forward complete! A real radio signal takes over 19 hours one-way—Pioneer 10 sent its final signal in 2003.',
    },
    miniGame: {
      title: 'Jupiter Gravity Slingshot',
      subtitle: "Use Jupiter's gravity to whip into deep space",
      instructions:
        "Aim Pioneer 10's launch angle and speed so Jupiter's massive gravity bends your trajectory and slingshots the probe right through the Deep Space Exit Gate toward Aldebaran!",
      controlsHint: 'Adjust Launch Angle & Speed sliders • Click Fire Thrusters',
    },
    quiz: [
      {
        question: 'What major barrier did Pioneer 10 become the first spacecraft to cross safely?',
        options: ['The Asteroid Belt', 'Saturn’s Rings', 'The Sun’s surface'],
        correctIndex: 0,
        explanation: 'Before Pioneer 10’s 1972–1973 flight, scientists weren’t sure spacecraft could survive the asteroid belt.',
      },
      {
        question: 'What is the Pioneer Plaque bolted onto the spacecraft?',
        options: [
          'A spare solar panel',
          'A gold-anodized aluminum message showing Earth’s location and humans',
          'A map of Mars’s craters',
        ],
        correctIndex: 1,
        explanation: 'The engraved gold-anodized aluminum plaque serves as a cosmic postcard for any future interstellar finders.',
      },
      {
        question: 'When did NASA receive the last faint signal from Pioneer 10?',
        options: ['1975', '2003', '2024'],
        correctIndex: 1,
        explanation: 'Pioneer 10’s final very weak signal was detected in January 2003 before its power dropped too low to transmit.',
      },
    ],
  },

  {
    id: 'kepler',
    destinationId: 'deep-space',
    name: 'Kepler Space Telescope',
    shortName: 'Kepler Telescope',
    heroImage: '/nasa/deep space/Kepler Space Telescope/NASA Kepler Space Telescope.png',
    launchYear: '2009',
    powerSource: 'Solar Panels',
    destinationLabel: 'Deep Space (Earth-Trailing Orbit)',
    status: 'Retired & Drifting Safely',
    tagline: 'The planet-hunting telescope that proved there are more planets than stars in our galaxy!',
    sourceUrl: 'https://science.nasa.gov/mission/kepler/',
    story: [
      {
        step: 1,
        label: '1. Launch',
        title: 'A Super-Camera Trailing Behind Earth',
        text: 'Launched in 2009, the Kepler Space Telescope didn’t circle Earth—it drifted in a quiet orbit trailing behind us around the Sun so Earth’s shadow would never block its view. Its mission: stare steadily at 150,000 stars at once!',
        icon: 'launch',
        chapterImage: '/story/deep space/Kepler Space Telescope/keplerlaunch-1.mp4',
        mediaType: 'video',
        mediaBadge: 'REAL NASA VIDEO',
        mediaCaption: 'Real 2009 Delta II rocket liftoff carrying the Kepler Space Telescope into Earth-trailing orbit.',
      },
      {
        step: 2,
        label: '2. The Mission',
        title: 'Spotting Tiny Winks of Starlight',
        text: 'Planets orbiting distant stars are way too dim to see next to blinding starlight. So Kepler used the "transit method": whenever an alien planet crossed in front of its star, the starlight dipped by a tiny fraction—like a moth flying past a distant lighthouse!',
        icon: 'mission',
        chapterImage: '/story/deep space/Kepler Space Telescope/PIA11984.jpg',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Kepler’s real "First Light" starfield image capturing over 100,000 stars in Cygnus and Lyra.',
      },
      {
        step: 3,
        label: '3. Amazing Discovery',
        title: 'Over 2,600 Alien Worlds Discovered!',
        text: 'Kepler changed astronomy forever! It confirmed more than 2,600 exoplanets—rocky Earth-sized worlds in the habitable zone, scorching lava planets, and even worlds with two suns in the sky—proving our galaxy holds more planets than stars!',
        icon: 'discovery',
        chapterImage: '/story/deep space/Kepler Space Telescope/keplerlast-ffipink_c19-sm.webp',
        mediaType: 'image',
        mediaBadge: 'REAL NASA PHOTO',
        mediaCaption: 'Kepler’s wide-field camera grid capturing thousands of distant stars to search for transiting exoplanets.',
      },
      {
        step: 4,
        label: '4. Abandoned, Not Forgotten',
        title: 'Retired & Drifting Safely',
        text: 'After nine years of nonstop planet hunting, Kepler was retired in 2018 after running out of thruster fuel. NASA sent a final "goodnight" command, leaving the telescope drifting peacefully in its safe, eternal orbit around the Sun.',
        icon: 'legacy',
        chapterImage: '/story/deep space/Kepler Space Telescope/kepler_eof_08-01-ws-oil-paint_filter.webp',
        mediaType: 'image',
        mediaBadge: 'NASA ARTIST CONCEPT',
        mediaCaption: 'Artist concept of the retired Kepler telescope drifting peacefully among the stars and exoplanets it helped discover.',
      },
    ],
    hotspots: [
      {
        id: 'kep-sunshade',
        number: 1,
        label: 'Angled Sunshade Aperture',
        image: '/nasa/deep space/Kepler Space Telescope/kepler_3_separate_transparent_assets/01_angled_aperture_sunshade.png',
        x: 26,
        y: 26,
        fact: 'Shielded Kepler’s ultra-sensitive glass lens from blinding sunlight so it could stare at faint stars without glare.',
      },
      {
        id: 'kep-barrel',
        number: 2,
        label: '0.95m Photometer Barrel',
        image: '/nasa/deep space/Kepler Space Telescope/kepler_3_separate_transparent_assets/02_photometer_barrel.png',
        x: 48,
        y: 44,
        fact: 'Housed a 95-megapixel camera sensitive enough to spot a tiny flea crawling across a car headlight kilometers away!',
      },
      {
        id: 'kep-solar',
        number: 3,
        label: '4-Panel Solar Array Wing',
        image: '/nasa/deep space/Kepler Space Telescope/kepler_3_separate_transparent_assets/03_four_panel_solar_array.png',
        x: 70,
        y: 68,
        fact: 'Supplied steady solar power in Kepler’s Earth-trailing orbit and even helped balance the telescope against gentle sunlight pressure.',
      },
    ],
    blueprintSlots: [
      {
        id: 'kep-slot-shield',
        slotName: 'Glare Protection',
        x: 26,
        y: 26,
        options: [
          {
            id: 'angled-sunshade',
            label: 'Angled Aperture Sunshade',
            image: '/nasa/deep space/Kepler Space Telescope/kepler_3_separate_transparent_assets/01_angled_aperture_sunshade.png',
            isCorrect: true,
          },
          {
            id: 'open-lens',
            label: 'Unshielded Open Lens',
            image: '/nasa/deep space/Kepler Space Telescope/kepler_6_wrong_decoy_transparent_assets/01_unshielded_open_lens.png',
            isCorrect: false,
            failureCategory: 'blackout',
            failureReason: 'Without a sunshade, blinding sunlight floods the camera and completely washes out distant starlight dips!',
          },
          {
            id: 'tinted-cover',
            label: 'Dark Tinted Plastic Cover',
            image: '/nasa/deep space/Kepler Space Telescope/kepler_6_wrong_decoy_transparent_assets/02_dark_tinted_plastic_cover.png',
            isCorrect: false,
            failureCategory: 'blackout',
            failureReason: 'Dark tint blocks the faint starlight Kepler needs to detect tiny 0.01% planet transits!',
          },
        ],
      },
      {
        id: 'kep-slot-camera',
        slotName: 'Planet-Hunting Sensor',
        x: 48,
        y: 44,
        options: [
          {
            id: 'phone-cam',
            label: 'Smartphone Camera',
            image: '/nasa/deep space/Kepler Space Telescope/kepler_6_wrong_decoy_transparent_assets/03_smartphone_camera.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'A phone camera cannot measure tiny 0.01% brightness dips across 150,000 stars at once!',
          },
          {
            id: 'photometer-barrel',
            label: '0.95m Photometer Barrel',
            image: '/nasa/deep space/Kepler Space Telescope/kepler_3_separate_transparent_assets/02_photometer_barrel.png',
            isCorrect: true,
          },
          {
            id: 'radar-dish',
            label: 'Radio Radar Dish',
            image: '/nasa/deep space/Kepler Space Telescope/kepler_6_wrong_decoy_transparent_assets/04_radio_radar_dish.png',
            isCorrect: false,
            failureCategory: 'instability',
            failureReason: 'Radar bounces signals off nearby objects—it cannot reach stars hundreds of light-years away!',
          },
        ],
      },
      {
        id: 'kep-slot-power',
        slotName: 'Solar Orbit Power',
        x: 70,
        y: 68,
        options: [
          {
            id: 'hand-crank',
            label: 'Mechanical Hand Crank',
            image: '/nasa/deep space/Kepler Space Telescope/kepler_6_wrong_decoy_transparent_assets/05_mechanical_hand_crank.png',
            isCorrect: false,
            failureCategory: 'blackout',
            failureReason: 'Nobody is in deep space to turn a crank—Kepler needed automatic solar power for 9 years!',
          },
          {
            id: 'steam-boiler',
            label: 'Mini Steam Boiler',
            image: '/nasa/deep space/Kepler Space Telescope/kepler_6_wrong_decoy_transparent_assets/06_mini_steam_boiler.png',
            isCorrect: false,
            failureCategory: 'no-oxygen',
            failureReason: 'Smoke and heat from a boiler ruin telescope optics and cannot burn without oxygen!',
          },
          {
            id: 'four-panel-solar',
            label: '4-Panel Solar Array Wing',
            image: '/nasa/deep space/Kepler Space Telescope/kepler_3_separate_transparent_assets/03_four_panel_solar_array.png',
            isCorrect: true,
          },
        ],
      },
    ],
    ping: {
      realTimeLabel: '~8.4 minutes (Earth-trailing)',
      distanceLabel: '~151 million km away',
      simDurationMs: 2600,
      isFastForward: true,
      resultNote: 'Fast-forward complete! Real signal takes ~8.4 minutes—Kepler was powered down in 2018 after running out of fuel.',
    },
    miniGame: {
      title: 'Exoplanet Transit Explorer',
      subtitle: 'Scan the Cygnus starfield and detect transiting exoplanets',
      instructions:
        "Peer through Kepler's photometer and pan across the starry Cygnus sky! Watch for stars that blink as a hidden planet crosses in front of them, lock on, and record the Stellar Brightness Light Curve to confirm 4 Exoplanet Candidates.",
      controlsHint: 'Drag sky (or WASD / Arrows) to pan telescope • Space / Tap button to record transit',
    },
    quiz: [
      {
        question: 'How did the Kepler Space Telescope find planets orbiting distant stars?',
        options: [
          'By landing on them',
          'By measuring tiny dips in starlight when a planet passes in front of its star',
          'By listening for alien radio stations',
        ],
        correctIndex: 1,
        explanation: 'This is called the transit method—like spotting a tiny moth crossing in front of a bright porch light.',
      },
      {
        question: 'Roughly how many confirmed exoplanets did Kepler discover?',
        options: ['Over 2,600', 'Only 8', 'Around 50'],
        correctIndex: 0,
        explanation: 'Kepler confirmed over 2,600 exoplanets and proved planets outnumber stars in the Milky Way!',
      },
      {
        question: 'Why did NASA retire Kepler in October 2018?',
        options: [
          'It crashed into Jupiter',
          'It ran out of fuel needed to aim its telescope',
          'It finished measuring every star in the universe',
        ],
        correctIndex: 1,
        explanation: 'After nine years of observations, Kepler depleted its thruster fuel and was safely decommissioned.',
      },
    ],
  },
];

export const getHardwareByDestination = (destinationId: DestinationId): HardwareItem[] =>
  hardwareItems.filter((item) => item.destinationId === destinationId);

export const getHardwareById = (id: HardwareId): HardwareItem | undefined =>
  hardwareItems.find((item) => item.id === id);
