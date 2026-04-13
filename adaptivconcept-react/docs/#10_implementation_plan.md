# Optimization for Small Screens and Tablets

The goal is to refine the React application's responsiveness to ensure a premium experience on mobile and tablet devices. This involves scaling down headings, reducing container rounding and padding, and adjusting text sizes to improve legibility and spacing.

## User Review Required

> [!IMPORTANT]
> The container rounding is currently set at a very high `60px` or `40px`. Proposed change will reduce this to `32px` or `24px` on mobile to prevent the "chunky" appearance while maintaining the premium feel.

## Proposed Changes

### Global Sizing Adjustments

Scale down headings, body text, and paddings using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).

---

### [Home Page](file:///C:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/pages/Home.jsx)

#### [MODIFY] [Home.jsx](file:///C:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/pages/Home.jsx)
- Reduce section container rounding from `[60px]` to `[32px] md:rounded-[60px]`.
- Adjust section padding from `p-10 md:p-20` to `p-6 md:p-14 lg:p-20`.
- Scale hero title and secondary headings down for mobile.
- Adjust button padding and text size for better tap targets on small screens.

### [Project Board](file:///C:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/pages/ProjectBoard.jsx)

#### [MODIFY] [ProjectBoard.jsx](file:///C:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/pages/ProjectBoard.jsx)
- Scale page title from `text-5xl` to `text-3xl` on mobile.
- Reduce card rounding from `rounded-3xl` to `rounded-2xl`.
- Reduce card padding from `p-8` to `p-6`.

### [Project Detail](file:///C:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/pages/ProjectDetail.jsx)

#### [MODIFY] [ProjectDetail.jsx](file:///C:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/pages/ProjectDetail.jsx)
- Reduce main container rounding from `[40px]` to `[24px] md:rounded-[40px]`.
- Scale title from `text-4xl` to `text-2xl` on mobile.
- Adjust "Deep Dive" section padding and typography (first-letter size).

### [UI Components](file:///C:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/)

#### [MODIFY] [HighlightCarousel.jsx](file:///C:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/HighlightCarousel.jsx)
- Scale the large carousel title from `text-5xl` to `text-3xl` on mobile.
- Adjust subtitle font size and line height.

#### [MODIFY] [Footer.jsx](file:///C:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/Footer.jsx)
- Reduce card rounding from `rounded-[24px]` to `rounded-xl`.
- Adjust Persona card sizes (`w-64` to `w-48` on small screens if needed).
- Scale LinkedIn/Github card title sizes for better fit.

#### [MODIFY] [MainContent.jsx](file:///C:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/components/MainContent.jsx)
- Replace static `fontSize: '160px'` with responsive Tailwind classes or relative units.
- Adjust Bootstrap-based column spacing for mobile.

## Open Questions

- Should I also adjust the navigation bar height or spacing for mobile? (Current audit suggests titles are close to navbar).

## Verification Plan

### Automated Tests
- N/A (Visual UI adjustments)

### Manual Verification
- Use `browser_subagent` to capture screenshots at 375px (Mobile), 768px (Tablet), and 1536px (Desktop) for Home, Project Board, and Project Detail pages.
- Verify that elements do not overlap and padding feels balanced.
