# 🌉 Lab Integration: PySwissShef UI Design

This document bridges the **PySwissShef** Lab UI with the main **Adaptivconcept-FL** design system.

## 🤝 Aesthetic Alignment

The Lab will utilize the core **Glassmorphism** layout of the main portfolio but with a distinctive **Python-Culinary** personality shift.

### Primary Differences:
- **Core Portfolio**: Purple accents (`#aa3bff`), Dark Grey BG.
- **PySwissShef Lab**: Gold accents (`#FFD43B`), Midnight Black BG (`#0a0b10`).

## 🛠️ Implementation Strategy

### 1. Themed CSS Bridge
We will implement a `lab.css` that mirrors the utility classes from `index.css` but overrides the `--accent` and `--bg` tokens to match the PySwissShef logo palette.

### 2. Component Mapping
- **Project Cards** in the main board $\rightarrow$ **Recipe Cards** in the lab.
- **App Navbar** $\rightarrow$ **Bistro Menu Navbar** with gold branding.

### 3. Integrated Experience
The "Lab Detail" page will use a themed iframe or direct bridge to the portal, ensuring the transition feels seamless through color-matched gradients.

---
> [!IMPORTANT]
> To maintain the "Premium" feel, we will avoid standard Bootstrap components (like blue buttons) and instead use the custom CSS variables defined in the Design Identity doc.
