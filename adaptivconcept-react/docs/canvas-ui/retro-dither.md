# Retro Dither overlay

This project now includes a lightweight retro dither effect overlay that blends over the existing animated background layers.

## What it does
- Adds a cursor-driven dither lens with a retro pixel look.
- Supports click-wave ripples for interactive feedback.
- Can be toggled and tuned from the UI Settings modal.

## Controls
- Enable / Disable: UI Settings > Canvas UI Effects > Retro Dither Overlay
- Strength: controls how prominent the dither effect is.
- Pixel Size: controls the coarseness of the retro pixels.
- Scanlines: adds subtle scanline texture.
- Click Wave: controls the intensity of the ripple effect created by clicks.

## Notes
- The effect is designed to work as an overlay layer and blend with the existing P5 animation and carousel imagery background.
- It uses the HTML-in-canvas-compatible path in Chromium-based browsers. Since the app already uses the relevant browser support, the effect is enabled in the current experience.
