# Implementation Plan - Fix Experimental Font Toggle Crash

The experimental fonts mechanism crashes when disabled because the current font index remains valid for the "Overkill" list but becomes invalid (out-of-bounds) for the standard list. This causes a React render crash, leading to a black screen (on dark themes) and preventing the setting from persisting in `localStorage`.

## User Review Required

> [!IMPORTANT]
> The fix involves adding defensive checks and automatic index resetting. This will ensure that if a user is currently viewing an "Overkill" font and disables it, the app will gracefully revert to a standard font instead of crashing.

## Proposed Changes

### Theme Context

#### [MODIFY] [ThemeContext.jsx](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/context/ThemeContext.jsx)

- Add defensive access to `currentFont` to prevent `undefined` properties from being accessed during render.
- Implement a `useEffect` to automatically reset `currentFontIndex` if it exceeds the bounds of `activeFonts`.
- Ensure `setIsOverkillEnabled` is handled consistently.

### Components

#### [MODIFY] [FLFontCarousel.jsx](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/FLFontCarousel.jsx)

- Add defensive checks for `currentFont` properties to ensure robustness even if the context state is momentarily inconsistent.

## Open Questions

None. The cause of the crash is clear from the code analysis.

## Verification Plan

### Automated Tests
- I will simulate the state transition in the context and verify that the index is corrected.

### Manual Verification
- Testing the toggle on the Project Board.
- Verifying that disabling "Overkill" mode while an "Overkill" font is active reverts to a standard font smoothly.
