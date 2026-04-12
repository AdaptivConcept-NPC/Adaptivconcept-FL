# Implementation Plan - Branding & Icon Corrections

Fixing identified visual regressions and branding inconsistencies in the Footer and Home page. This includes restoring the official LinkedIn color palette, fixing broken social icons, and ensuring site-wide branding matches the Navbar.

## User Review Required

> [!IMPORTANT]
> I noticed the **GitHub** and **Twitter** icons are currently invisible in the footer. I will switch these to `lucide-react` equivalents to ensure they render reliably across all browsers, matching the **Email** and **Chevron** icons already in use.

## Proposed Changes

### [Component] [Footer.jsx](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/Footer.jsx)

- **Brand Synchronization**:
    - Change the all-orange brand name to match the Navbar: `AdaptivConcept` (White) and `FL` (Orange).
    - Ensure the logo image is correctly aligned with the brand text.
- **LinkedIn Card Overhaul**:
    - **Links**: Update the card to point to the personal profile (`thabang-mposula-iarxii`). 
    - **Company Link**: Add a secondary "Company House" action or small link pointing to the `adaptivconcept-fl` page.
    - **Branding**: Change the color scheme from Orange to **LinkedIn Blue (`#0077b5`)**. This includes the border, icon background, and text accents.
- **Social Icon Restoration**:
    - Replace `bi-github` and `bi-twitter-x` with `Github` and `Twitter` from `lucide-react`.
    - Apply consistent hover states (`hover:bg-[#0077b5]` for LinkedIn related and `hover:bg-adaptiv-orange` for branding).

### [Component] [Home.jsx](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/pages/Home.jsx)

- **Typo Corrections**:
    - Revert `h-screenz` back to `h-screen` in the `ParallaxSection` to restore correct viewport height and stacking behavior.
- **Section Layout**:
    - Retain the user's manual spacing and text sizing preferences while ensuring the structural elements (height, sticky behavior) are functional.

## Verification Plan

### Manual Verification
- **Visual Audit**:
    - Confirm the GitHub and Twitter icons are now visible and interactive.
    - Check that the LinkedIn card uses the correct Blue shade and points to the right profile.
    - Verify that the Footer brand matches the Navbar brand 1:1.
- **Functional Check**:
    - Ensure the "h-screen" sections snap and stack correctly as the user scrolls.
