/**
 * Destination / planet metadata for the Solar System map.
 *
 * To unlock a new destination later: set `isActive: true`, give it a
 * `stop`, `stopTitle`, `hook`, and fill its `hardware` list. Everything else on
 * the map (preview cards, dock, progress totals) picks it up automatically.
 */

export type DestinationId =
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'moon'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'deep-space';

/** Drives how the flat planet illustration is drawn. */
export type PlanetVisual =
  | 'rocky'
  | 'cloudy'
  | 'earth'
  | 'moon'
  | 'mars'
  | 'gas'
  | 'ringed'
  | 'ice'
  | 'deepspace';

export interface HardwarePreview {
  id: string;
  name: string;
  years: string;
}

export interface Destination {
  id: DestinationId;
  name: string;
  /** Short descriptor shown under the name. */
  subtitle: string;
  /** Selectable in this phase? */
  isActive: boolean;
  /** Earth: the "Launchpad / Home" marker. */
  isHome?: boolean;
  /** Stop number in the story (active destinations only). */
  stop?: number;
  stopTitle?: string;
  /** Short kid-friendly hook for the preview card. */
  hook?: string;
  hardwareCount: number;
  hardware: HardwarePreview[];
  /** Message for locked sectors. */
  lockedMessage?: string;
  /**
   * Normalized distance from the Sun (0 = just outside the Sun, 1 = outer edge
   * of the map). Not to scale — tuned for readability.
   */
  orbitRadius: number;
  /** Relative diameter (1 = base planet size, which scales with screen). */
  size: number;
  /** Accent color (target rings, labels, badges, CTA). */
  color: string;
  /** Flat illustration colors: body, surface detail, terminator shadow. */
  palette: { base: string; detail: string; shade: string };
  visual: PlanetVisual;
  position: {
    /**
     * Where along its orbit ring the body sits, from -1 to 1
     * (-1 = top / left edge of the map lane, 0 = center, 1 = bottom / right).
     */
    lane: number;
    /** Moons: the body they orbit. */
    parentId?: DestinationId;
    /** Moons: orbit distance in multiples of the base planet size. */
    moonOrbit?: number;
  };
}

export const destinations: Destination[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    subtitle: 'The scorched speedster',
    isActive: false,
    hardwareCount: 0,
    hardware: [],
    lockedMessage: 'The fastest planet zooms around the Sun every 88 days.',
    orbitRadius: 0.05,
    size: 0.5,
    color: '#A8A29E',
    palette: { base: '#9A948C', detail: '#7D776F', shade: '#000000' },
    visual: 'rocky',
    position: { lane: 0.35 },
  },
  {
    id: 'venus',
    name: 'Venus',
    subtitle: 'The cloudy hothouse',
    isActive: false,
    hardwareCount: 0,
    hardware: [],
    lockedMessage: 'Hidden under thick, toasty clouds, Venus is the hottest planet in our solar system.',
    orbitRadius: 0.13,
    size: 0.8,
    color: '#E2B66E',
    palette: { base: '#E2B66E', detail: '#C99A4E', shade: '#000000' },
    visual: 'cloudy',
    position: { lane: -0.5 },
  },
  {
    id: 'earth',
    name: 'Earth',
    subtitle: 'Launchpad / Home',
    isActive: false,
    isHome: true,
    hardwareCount: 0,
    hardware: [],
    lockedMessage: 'Home base! Every single mission on this map blasted off from right here.',
    orbitRadius: 0.23,
    size: 0.85,
    color: '#60A5FA',
    palette: { base: '#2F6FD6', detail: '#3FA34D', shade: '#000000' },
    visual: 'earth',
    position: { lane: 0.12 },
  },
  {
    id: 'moon',
    name: 'The Moon',
    subtitle: "Earth's dusty neighbor",
    isActive: true,
    stop: 1,
    stopTitle: 'Stop 1: The Moon — Moon Buggies & Science Stations',
    hook: 'Astronauts drove electric fold-up cars across lunar craters and left a nuclear-powered science station that listened to moonquakes for years!',
    hardwareCount: 2,
    hardware: [
      { id: 'lrv-1', name: 'Apollo 15 Lunar Roving Vehicle', years: '1971' },
      { id: 'apollo-12-alsep', name: 'Apollo 12 ALSEP Station', years: '1969' },
    ],
    orbitRadius: 0.23,
    size: 0.42,
    color: '#CBD5E1',
    palette: { base: '#C9CFD8', detail: '#9AA3B0', shade: '#000000' },
    visual: 'moon',
    position: { lane: 0, parentId: 'earth', moonOrbit: 1.9 },
  },
  {
    id: 'mars',
    name: 'Mars',
    subtitle: 'The Red Planet',
    isActive: true,
    stop: 2,
    stopTitle: 'Stop 2: Mars — Planet of Robots',
    hook: 'Meet the twin rovers that outlived a 90-day mission by 15 years—and the tiny helicopter that flew 72 times in thin Martian air!',
    hardwareCount: 2,
    hardware: [
      { id: 'spirit-opportunity', name: 'Spirit & Opportunity', years: '2003' },
      { id: 'ingenuity', name: 'Ingenuity Mars Helicopter', years: '2020' },
    ],
    orbitRadius: 0.35,
    size: 0.75,
    color: '#E4572E',
    palette: { base: '#D9532F', detail: '#A63A1E', shade: '#000000' },
    visual: 'mars',
    position: { lane: -0.35 },
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    subtitle: 'The giant of giants',
    isActive: false,
    hardwareCount: 0,
    hardware: [],
    lockedMessage: 'So big that 1,300 Earths could fit inside its swirling storm clouds!',
    orbitRadius: 0.5,
    size: 1.9,
    color: '#D7A46E',
    palette: { base: '#D7A46E', detail: '#B9814B', shade: '#000000' },
    visual: 'gas',
    position: { lane: 0.55 },
  },
  {
    id: 'saturn',
    name: 'Saturn',
    subtitle: 'The ringed wonder',
    isActive: false,
    hardwareCount: 0,
    hardware: [],
    lockedMessage: 'Its famous rings are made of billions of chunks of ice and rock.',
    orbitRadius: 0.64,
    size: 1.55,
    color: '#E0C483',
    palette: { base: '#E0C483', detail: '#C5A762', shade: '#000000' },
    visual: 'ringed',
    position: { lane: -0.5 },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    subtitle: 'The sideways ice giant',
    isActive: false,
    hardwareCount: 0,
    hardware: [],
    lockedMessage: 'This ice giant spins tipped completely on its side, like a rolling ball.',
    orbitRadius: 0.76,
    size: 1.15,
    color: '#7CC8E0',
    palette: { base: '#7CC8E0', detail: '#68B3CB', shade: '#000000' },
    visual: 'ice',
    position: { lane: 0.42 },
  },
  {
    id: 'neptune',
    name: 'Neptune',
    subtitle: 'The windy blue world',
    isActive: false,
    hardwareCount: 0,
    hardware: [],
    lockedMessage: 'Home to the fastest supersonic winds in the entire solar system.',
    orbitRadius: 0.87,
    size: 1.1,
    color: '#4F6BFF',
    palette: { base: '#3B5BDB', detail: '#2F4BC0', shade: '#000000' },
    visual: 'ice',
    position: { lane: -0.32 },
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    subtitle: 'Kuiper Belt & beyond',
    isActive: true,
    stop: 3,
    stopTitle: 'Stop 3: Deep Space — Distant Pioneers & Planet Hunters',
    hook: 'Explore the first spacecraft to cross the asteroid belt—carrying a golden plaque—and the telescope that discovered over 2,600 alien worlds!',
    hardwareCount: 2,
    hardware: [
      { id: 'pioneer-10', name: 'Pioneer 10', years: '1972' },
      { id: 'kepler', name: 'Kepler Space Telescope', years: '2009' },
    ],
    orbitRadius: 1,
    size: 2.0,
    color: '#8EA2FF',
    palette: { base: '#C7D2FE', detail: '#8EA2FF', shade: '#000000' },
    visual: 'deepspace',
    position: { lane: 0.06 },
  },
];

export const activeDestinations = destinations.filter((d) => d.isActive);

export const totalHardware = activeDestinations.reduce((sum, d) => sum + d.hardwareCount, 0);

export const getDestination = (id: DestinationId): Destination | undefined =>
  destinations.find((d) => d.id === id);
