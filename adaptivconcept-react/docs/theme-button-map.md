# Button Map & Theme Contrast

Reference map of every primary/interactive button in the app and how its text
color is resolved, so that the **Neon Blue** (`#00f2ff`) and **Cyber Green**
(`#39ff14`) themes can guarantee **dark button text** for contrast.

## Central mechanism

`src/context/ThemeContext.jsx`

1. Each color in the `colors` array may carry an optional `onColor` (the text
   color that should sit **on top of** the theme color):
   - `Neon Blue` -> `onColor: "#0a0a0a"`
   - `Cyber Green` -> `onColor: "#0a0a0a"`
   - all other themes -> no `onColor`, default `#ffffff`
2. On theme change the provider sets a CSS variable:
   `--on-theme-text` = `themeColor.onColor || "#ffffff"`
3. The colored-wash `--btn-hover-text` now uses `var(--on-theme-text, #ffffff)`,
   so `.btn-adaptive-hover:hover` turns into **dark text on the bright theme
   color** for Neon Blue / Cyber Green, and stays white for every other theme.

## How button text color is resolved

| Source                              | Resting color                       | Hover color (btn-adaptive-hover)        |
| ----------------------------------- | ----------------------------------- | --------------------------------------- |
| `UISettingsButton`                  | `themeColor.onColor` (fallback accent) | n/a (own hover)                         |
| Solid theme-bg CTAs (inline style)  | `var(--on-theme-text, #fff)` / `themeColor.onColor` | `--btn-hover-text` = `--on-theme-text` |
| Ghost/hover-only CTAs (class-based) | existing class (`text-high` etc.)   | `--btn-hover-text` = `--on-theme-text`  |

## Group A — Solid theme-color background + text on top (fixed to dark on Neon/Cyber)

| File | Line | Element | Text resolution now |
|------|------|---------|--------------------|
| `src/components/layout/UISettingsButton.jsx` | 10-29 | UI Settings pill | `onThemeColor = themeColor.onColor \|\| accentColor` |
| `src/components/layout/Navbar.jsx` | 217-242 | “Hire Me” CTA Link | `themeColor.onColor \|\| (light ? #111 : #fff)` |
| `src/pages/Home.jsx` | 352 | “Let's Talk” | `themeColor.onColor \|\| isHighContrast <...> : #fff` |
| `src/pages/Home.jsx` | 553 | “Deploy Brief” submit | `themeColor.onColor \|\| ... : #fff` |
| `src/pages/Home.jsx` | 731 | “Case Study” | `var(--on-theme-text, #ffffff)` (was invalid `contrast-color()`) |
| `src/pages/TechWall.jsx` | 168 | “Initiate Project” | `themeColor.onColor \|\| (coal/light/white)` |
| `src/pages/Contact.jsx` | 268 | “Deploy Transmission” | `themeColor.onColor \|\| (light ? #111 : #fff)` |
| `src/pages/BlogDetail.jsx` | 173 | “Back to Blog” | `var(--on-theme-text, #ffffff)` |
| `src/pages/ProjectDetail.jsx` | 25 / 90 | “Back to Board” / “View Repository” | `var(--on-theme-text, #ffffff)` |
| `src/components/BlogPost.jsx` | 84 | “Read Article” | `var(--on-theme-text, #ffffff)` (was invalid `contrast-color()`) |
| `src/pages/ProjectBoard.jsx` | 238, 340, 379, 488 | “Enter Lab”, “Deploy Request”, active filter, “Deep Dive” | `var(--on-theme-text, #ffffff)` (was invalid `contrast-color()`) |
| `src/components/layout/AgentChatSection.jsx` | 114-120 | send button | inline `color: var(--on-theme-text, #ffffff)` |
| `src/pages/games/DigiArch.jsx` | 264 | “Submit Layout” | `themeColor.onColor \|\| (light ? #000 : #fff)` |
| `src/pages/invoicing/*.jsx` | several | primary CTAs (`background: var(--theme-color)`) | inline `color: var(--on-theme-text, #ffffff)` |

## Group B — ghost/class buttons whose **hover** fills with the theme color

These are fixed globally via `--btn-hover-text` = `var(--on-theme-text, #ffffff)`
(`src/context/ThemeContext.jsx`). No per-button change needed.

| File | Element |
|------|---------|
| `src/components/layout/Navbar.jsx` 160-203 | Résumé, Dev Arcade |
| `src/pages/Home.jsx` 367 | “Project Catalog” |
| `src/components/BlogPost.jsx` 97 | LinkedIn icon |
| `src/pages/BlogDetail.jsx` 264 | Share button |
| `src/pages/ProjectDetail.jsx` 95-104 | “Project Link”, “Request Full Documentation” |
| `src/components/Footer.jsx` 314 | social icon buttons (`hover-bg`/`hover-text`) |

## Group C — Untouched (no theme-bg)

Toast/close buttons, glass nav links, toggle switches, carousel arrows/dots,
settings rows, admin/static brand buttons, game success buttons (fixed green +
black text already), LinkedIn/fixed-brand buttons. These keep existing colors.