# Cosmic Hardware Map — NASA's Space Treasure Map

Step 1: the interactive Solar System landing screen.

## Run it

Requires [Node.js 18+](https://nodejs.org/) (LTS recommended).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Structure

```
src/
  data/destinationsData.ts   # All planet/destination metadata (unlock new stops here)
  data/avatars.ts            # Avatar Shop placeholder items
  utils/layout.ts            # Converts orbitRadius + lane into pixel positions (landscape / portrait)
  hooks/useElementSize.ts    # ResizeObserver hook for responsive layout
  components/
    StarField.tsx            # Gradient, nebulas, twinkling stars, shooting stars
    TopHUD.tsx               # Glass explorer panel: logo, avatar, coins, shop, progress
    SolarSystemMap.tsx       # Sun, orbit rings, Kuiper Belt, planets, preview card positioning
    PlanetButton.tsx         # Interactive planet node: pulse, reticle, badge, label
    PlanetOrb.tsx            # Pure-CSS painted planets & Deep Space portal
    DestinationPreviewCard.tsx
    QuickDock.tsx            # Touch-friendly bottom destination cards
    AvatarShopModal.tsx      # Placeholder shop
    DestinationView.tsx      # Placeholder for Step 2 (Destination Hardware View)
```

## Unlocking a new destination

In `destinationsData.ts`, set `isActive: true` and add `stop`, `stopTitle`, `hook`,
`hardwareCount` and `hardware`. The map, preview card, dock and the
"Hardware Discovered" total update automatically.
