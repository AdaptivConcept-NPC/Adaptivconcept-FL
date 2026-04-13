# Profile Personas Widget Implementation

The goal is to create a sleek, interactive profile picture card in the footer that cycles through (or fans out) different profile images upon hover, representing distinct professional identities (Microsoft vs GitHub).

## User Review Required

> [!IMPORTANT]
> **Placement Strategy**: I propose placing this widget in the third column of the footer grid. This will displace the current "Secondary Socials" layout slightly but provides a much stronger visual anchor for the footer.

## Proposed Changes

### [UI Components]

#### [MODIFY] [Footer.jsx](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/Footer.jsx)

I will implement a new sub-component `ProfilePersonas` inside `Footer.jsx` (or as a separate file if it gets too large) that:
1.  Defines a stack of 4 images with slight offsets.
2.  Uses `framer-motion` `whileHover` to "fan out" the cards in a 3D perspective, revealing each variant.
3.  Applies a premium glassmorphic container with neon accents matching the AdaptivConcept brand.

**Images to be integrated:**
- Professional: `my-profile-pic-microsoft-original.png`
- Corporate Vector: `my-profile-pic-microsoft-vector.png`
- Developer: `my-profile-pic-github.jpg`
- Tech Vector: `my-profile-pic-github-vector.png`

## Verification Plan

### Automated Tests
- I will verify the rendering of the component using a browser screenshot.
- I will check the console for any missing asset warnings.

### Manual Verification
- Testing the hover interaction: ensure the cards expand smoothly and do not overlap text in adjacent columns.
- Verify responsiveness on mobile (stacking vertically).
