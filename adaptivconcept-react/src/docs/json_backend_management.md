# JSON-as-Backend Management Guide

This document outlines the standard procedures for managing site content using the "JSON-as-Backend" approach in the AdaptivConcept FL ecosystem. This method allows for centralized, version-controlled content management that remains highly performant and easy to modify.

## 1. Core Data Structures

Content is primarily stored in `src/data/`:
- **`projects.json`**: Portfolio items, categories, and technical details.
- **`blog.json`**: Article metadata, tags, and references.
- **`tech-approach.js`**: Narratives for the specialized Tech Wall.

## 2. Centralized Control via UI (Future State)

While content is currently managed via JSON files, the architecture is designed to support a future Admin UI.
- **Current Workflow**: Modify JSON files → Commit to Git → Deployment via Netlify/GitHub Actions.
- **Next Phase**: A dedicated `/admin` route will provide forms to edit these JSON objects, which then trigger a backend script (e.g., via Netlify Functions) to update the repository.

## 3. Best Practices for Updates

### Project Entries
When adding a new project to `projects.json`, ensure the following:
- **`id`**: Unique alphanumeric string (e.g., `fabric-automation-2024`).
- **`isHero`**: Set to `true` to feature on the Home Page carousel.
- **`techStack`**: Use keys that match the `iconMap` in `HighlightCarousel.jsx`.

### Blog Posts
- **`date`**: Use ISO format (YYYY-MM-DD) for proper sorting.
- **`slug`**: Ensure it matches the folder structure if using markdown-based post bodies.

## 4. Maintenance & Synchronization

> [!TIP]
> **Validation Script**: Use the local `validate_data.py` (if available) to ensure all icon paths exist and JSON syntax is valid before pushing.

### Syncing with External Sources
If you are using the LinkedIn Content Pipeline:
1. Run the `sync_linkedin.py` script.
2. Review the `blog.json` updates.
3. Commit and push.

## 5. Troubleshooting

- **Icons not showing**: Check `src/components/HighlightCarousel.jsx`'s `iconMap`. Ensure the key in your JSON matches the key in the map exactly.
- **Project Board Layout**: The board is responsive. If a card looks "off", check that the `description` length is consistent with other entries (approx. 200-300 characters).

---
*Created by Antigravity | AdaptivConcept FL Ecosystem*
