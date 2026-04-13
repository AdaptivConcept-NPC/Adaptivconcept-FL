# Branding and Interactive Narrative Implementation

This plan covers the visual refinement of 'AdaptivConcept' branding and the implementation of a dynamic narrative system in the footer that reacts to your profile personas.

## Proposed Changes

### [Branding]

#### [MODIFY] [Navbar.jsx](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/layout/Navbar.jsx)
- Append the trademark symbol `™` to all instances of "AdaptivConcept".

#### [MODIFY] [Footer.jsx](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/Footer.jsx)
- Append the trademark symbol `™` to all instances of "AdaptivConcept".

### [Interactive Persona Widget]

#### [MODIFY] [Footer.jsx](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/Footer.jsx)

**1. Layout Refinement:**
- Set the `ProfilePersonas` container to `justify-end` and ensure the horizontal fan-out offset (`x`) is primarily negative (sliding left) to prevent off-screen spill on the right.

**2. Dynamic Narrative Logic:**
- Introduce a `useState` hook to track the active persona on hover.
- Map each persona to a distinct professional narrative:
    - **Professional**: "Enterprise expertise with Microsoft-standard precision."
    - **Corporate Vector**: "Architecting strategic digital transformation."
    - **Tech Vector**: "Bridging data gaps with intelligent visualization."
    - **Developer**: "Innovating with local LLMs and open-source stacks."
- **Narrative Styling Upgrades**:
    - Change color from `text-gray-500` to `text-white`.
    - Increase font size from `text-xs` to `text-sm`.
    - Enhance readability with a slightly larger `max-w`.

## Verification Plan

### Automated Tests
- Browser validation to confirm the trademark symbol renders correctly.
- Verify state updates by hovering over the widget and observing text changes in the narrative section.

### Manual Verification
- Confirm that cards fan out to the left and do not hit the browser edge.
- Visual audit of the new white narrative text for readability against the dark background.
