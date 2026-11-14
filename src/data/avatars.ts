export type AvatarIconId =
  | 'helmet'
  | 'rover'
  | 'helicopter'
  | 'lander'
  | 'voyager'
  | 'saturn'
  | 'telescope'
  | 'nebula'
  | 'patch';

export interface Avatar {
  id: AvatarIconId;
  name: string;
  cost: number;
  image: string;
}

export interface AvatarFrame {
  id: string;
  name: string;
  cost: number;
  borderColor: string;
  bgColor: string;
}

export const avatars: Avatar[] = [
  { id: 'helmet', name: 'Rookie Astronaut', cost: 0, image: '/avatars/avatar-1.png' },
  { id: 'rover', name: 'Moon Buggy Driver', cost: 100, image: '/avatars/avatar-2.png' },
  { id: 'helicopter', name: 'Mars Helicopter Pilot', cost: 150, image: '/avatars/avatar-3.png' },
  { id: 'lander', name: 'Mars Lander Chief', cost: 200, image: '/avatars/avatar-4.png' },
  { id: 'voyager', name: 'Deep Space Voyager', cost: 250, image: '/avatars/avatar-5.png' },
  { id: 'saturn', name: 'Saturn Explorer', cost: 300, image: '/avatars/avatar-6.png' },
  { id: 'telescope', name: 'Exoplanet Hunter', cost: 350, image: '/avatars/avatar-7.png' },
  { id: 'nebula', name: 'Nebula Commander', cost: 400, image: '/avatars/avatar-8.png' },
  { id: 'patch', name: 'Solar System Legend', cost: 500, image: '/avatars/avatar-9.png' },
];

export const avatarFrames: AvatarFrame[] = [
  { id: 'default', name: 'Lunar Silver', cost: 0, borderColor: '#94A3B8', bgColor: '#151C2E' },
  { id: 'ochre', name: 'Martian Ochre', cost: 100, borderColor: '#E4572E', bgColor: '#241413' },
  { id: 'cyan', name: 'Deep Space Cyan', cost: 150, borderColor: '#38BDF8', bgColor: '#0F2233' },
  { id: 'gold', name: 'Solar Gold', cost: 250, borderColor: '#FBBF24', bgColor: '#251D0D' },
];

export function getMissionRank(discoveredCount: number): string {
  if (discoveredCount >= 6) return 'Solar System Master';
  if (discoveredCount >= 4) return 'Senior NASA Engineer';
  if (discoveredCount >= 2) return 'Planetary Scout';
  return 'Space Cadet';
}
