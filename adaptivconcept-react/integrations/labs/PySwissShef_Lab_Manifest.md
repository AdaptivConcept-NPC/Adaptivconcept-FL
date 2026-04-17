# PySwissShef Lab Manifest 🧪

This document outlines the technical strategy for integrating the **PySwissShef** catalogue into a high-fidelity StackBlitz lab environment.

## 🎯 Goal
Provide a "One-Click" interactive experience where users can browse, run, and modify Python and Shell scripts without local setup.

## 🛠️ StackBlitz Configuration

### 1. WebContainer Environment
- **Runtime**: Node.js (WebContainers)
- **Python Support**: WASM-based Python interpreter.
- **Shell Support**: POSIX-compliant terminal.

### 2. File Invariants
The lab expects the following structure in the PySwissShef repository:
- `index.html`: A clean web "Menu" for the catalogue.
- `main.py`: The entry point script for interactive mode.
- `.stackblitzrc`:
  ```json
  {
    "startCommand": "python main.py",
    "installDependencies": false
  }
  ```

## 📋 Prerequisites
The following dependencies must be pre-bundled or lazy-loaded:
- `PyScript` or `Pyodide` (for browser-side Python execution).
- Basic shell utilities (`bash`, `curl`, `grep`).

## 🚀 Execution Roadmap

### Phase 1: Repository Alignment (Ready)
- [x] Rename repository to `PySwissShef`.
- [x] Consolidate `.sh` and `.py` files into organized subdirectories.

### Phase 2: Portal Development (Upcoming)
- [ ] Create `index.html` dashboard for the StackBlitz portal.
- [ ] Implement `main.py` CLI dispatcher.
- [ ] Add `.stackblitzrc` for automated boot.

### Phase 3: Portfolio Sync
- [ ] Test the "Enter Lab" bridge from the Adaptivconcept-FL dashboard.
- [ ] Verify prerequisite detection logic in `LabDetail.jsx`.

---
> [!TIP]
> Use StackBlitz "Projects API" to dynamically generate labs if the catalogue grows beyond a single repository.
