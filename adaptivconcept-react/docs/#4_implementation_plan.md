# Implementation Plan - FL Font Carousel

Create an artistic visual component that cycles through 16 distinct custom fonts for the text "FL" every 2-3 seconds.

## Proposed Changes

### [Styles]

#### [NEW] [fonts.css](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/styles/fonts.css)
Register the following fonts using `@font-face`:
- `BigPartyBlue`, `BigPartyGreen`, `BlackTakora`, `Fattern`, `GraffitiStream`, `GrindyBrush`, `HelpMe`, `IslandSplash`, `Measter`, `NoctraDrip`, `PermanentMarker`, `PunkKid`, `StormGust`, `Sudegnak`, `SuperBalloon`, `Jacatra`.
- Paths will point to `/fonts/[folder]/[file]`.

### [Core]

#### [MODIFY] [main.jsx](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/main.jsx)
Import `src/styles/fonts.css` to make fonts globally available.

#### [MODIFY] [FLFontCarousel.jsx](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/FLFontCarousel.jsx)
- **State**: Maintain `currentFontIndex`.
- **Logic**: `useEffect` with `setInterval` (2500ms).
- **Animation**: `AnimatePresence` with `motion.div`.
- **Transitions**: Scale and opacity animation for a "popping" artistic feel.
- **Props**: Support `size` and optional `color` customization.

## Verification Plan

### Manual Verification
1.  Verify `fonts.css` loads correctly in DevTools (no 404s for font files).
2.  Confirm "FL" text updates its font-family every 2.5 seconds.
3.  Check that animations are smooth and handle font-switching gracefully.
