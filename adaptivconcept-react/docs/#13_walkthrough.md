# Walkthrough - Button Hover Priority Fix

I have resolved the specificity issue in the **AdaptivConcept-FL** design system where inline styles (like `color: var(--text-h)`) were overriding the dynamic hover colors on the Coal and Light themes.

## Changes Made

### 1. Enhanced Global Utility (`index.css`)
I updated the `.btn-adaptive-hover` utility to insure that hover states always win, even against inline styles and nested icons:
```css
.btn-adaptive-hover:hover {
  background-color: var(--btn-hover-bg) !important;
  color: var(--btn-hover-text) !important;
  border-color: var(--btn-hover-bg) !important;
}

.btn-adaptive-hover:hover svg,
.btn-adaptive-hover:hover i {
  color: var(--btn-hover-text) !important;
}
```

### 2. Component Integration
I swept through the primary components and replaced hardcoded hover classes with the prioritized utility:
- **Navbar.jsx**: Fixed the white-on-white text issue in the mobile and desktop menus.
- **Home.jsx**: Applied to the Hero CTA, Project Catalog, Service Icons, and Github/Live links.
- **ProjectBoard.jsx**: Applied to the "Enter Lab" and "Deep Dive" buttons.
- **ProjectDetail.jsx**: Updated all action buttons and back links.
- **Blog Components**: Updated `BlogPost` and `BlogDetail` for consistency.

## Validation

### Manual Verification Results
- [x] **Coal Theme**: Navbar buttons now flip to **Black text on White background** on hover, overriding the default white text.
- [x] **Light Theme**: Buttons flip to **White text on Black background**.
- [x] **Icons**: Lucide and Bootstrap icons now correctly switch color alongside the text.

---
**Status**: Styling calibration complete and prioritized.
