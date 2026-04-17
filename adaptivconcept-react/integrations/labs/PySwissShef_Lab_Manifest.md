# PySwissShef Lab Manifest 🧪

This document outlines the stabilized environmental strategy for the **PySwissShef** Laboratory Catalogue.

## 🎯 Final Strategy: The Multi-Station Lab
Rather than forcing a single environment, PySwissShef now supports a hierarchy of "Stations" optimized for different levels of script complexity.

### 🍨 Station 1: The Tasting Room (StackBlitz)
- **Use Case**: Quick UI browsing and standard library script previews.
- **Runtime**: WASM-based Python (WebContainers).
- **Setup**: Automated via `package.json` and `setup_stackblitz.sh`.

### 🥘 Station 2: The High-Heat Kitchen (Replit)
- **Use Case**: FULL execution of automation recipes.
- **Runtime**: Linux Virtual Machine.
- **Setup**: Native `pip install -r requirements.txt`.

### 🧪 Station 3: The Pro Lab (GitHub Codespaces)
- **Use Case**: Deep development, heavy data, and long-running automation.
- **Runtime**: Dedicated Cloud VM with full Docker support.

---

## 🛠️ Configuration Status

### 1. In-Process Execution Engine (LIVE)
- [x] Refactored `main.py` to remove `subprocess` blockers.
- [x] Implemented `runpy` based script execution in `views.py`.
- [x] Captured STDOUT/STDERR via in-process buffers for browser compatibility.

### 2. Portal Inventory (COMPLETE)
- [x] **Gourmet UI**: Cyber-Bistro aesthetic implemented across all Django templates.
- [x] **Security Engine**: One-time session-managed disclaimer.
- [x] **Catalogue**: Categorized scripts with detailed "stories" and GitHub links.

### 3. Orchestration Files (LIVE)
- [x] `package.json`: NPM-standard start command for cloud environments.
- [x] `setup_stackblitz.sh`: Environment-aware bootstrap diagnostics.
- [x] `.stackblitzrc`: Optimized boot configuration.

---

## 🚀 Future Roadmap
- [ ] **Dynamic Sample Data**: Implement "Chef's Ingredients" loader for heavy recipes in the Tasting Room.
- [ ] **Lab Bridge**: Finalize the "Enter Laboratory" transitions from the main FL Portfolio.

---
> [!IMPORTANT]
> **Station Selection**: Always refer to the **[Chef's Guide to Lab Stations](docs/LAB_STATIONS.md)** when selecting an environment for high-heat recipes.
