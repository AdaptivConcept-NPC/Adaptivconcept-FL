# Enhancement Plan: Interactive Highlight Carousel

Enhance the `HighlightCarousel` component with mobile-friendly swipe gestures, desktop navigation buttons, and improved auto-play logic that pauses on interaction.

## Proposed Changes

### [HighlightCarousel.jsx](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/HighlightCarousel.jsx)

#### [MODIFY]

- **State Management**:
  - Add `isPaused` state (boolean) to track user interaction.
- **Auto-Play Logic**:
  - Refactor `useEffect` to clear and reset the interval based on `isPaused`.
  - Add `onMouseEnter` / `onMouseLeave` to the main container to pause/resume auto-play.
  - Add `onTouchStart` / `onTouchEnd` for mobile "hold to pause" behavior.
- **Swipe Interaction**:
  - Add `drag="x"` and `dragConstraints={{ left: 0, right: 0 }}` to the main `motion.div`.
  - Implement `onDragEnd` to detect swipe direction and update the carousel index.
- **Navigation Buttons**:
  - Add `ChevronLeft` and `ChevronRight` buttons (using `lucide-react`).
  - Style them with glassmorphism (semi-transparent background, blur) and orange hover states.
  - Hide them on mobile viewports (`hidden lg:flex`).
- **Layout Adjustments**:
  - Ensure the carousel container has a relative position to house the absolute navigation buttons.

## Verification Plan

### Manual Verification
- **Desktop**:
  - Verify that hovering over the carousel pauses the auto-switch.
  - Click Navigation buttons to change slides.
  - Test browser responsiveness (buttons should hide on mobile width).
- **Mobile** (via Chrome DevTools):
  - Verify swipe left/right changes the slides.
  - Verify that holding a finger on the carousel pauses the auto-switch.
