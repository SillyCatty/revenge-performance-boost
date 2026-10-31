# Discord Performance Boost Plugin for Revenge / Vendetta

A focused performance optimization plugin designed to reduce lag, scroll freezes, battery drain, and thermal throttling in Discord mobile.

## Features
- **Telemetry & Science Blocker (`NoTrack`):** Intercepts and drops background analytics pings and scroll impressions that bog down network and CPU threads.
- **Typing Indicator Throttler:** Suppresses constant `TYPING_START` / `TYPING_STOP` Flux dispatches to eliminate message list layout re-renders.
- **Sticker Animation Thermal Governor:** Changes animated stickers to animate only on user interaction instead of infinite loops in the viewport, preventing GPU spikes and overheating.
- **Visual Status Toast:** Displays a confirmation toast upon successful activation.

## Installation
In Revenge / Bunny:
1. Open **Settings > Plugins**.
2. Tap **Install Plugin** (+).
3. Paste:
   ```text
   https://sillycatty.github.io/revenge-performance-boost/
   ```
   or
   ```text
   https://raw.githubusercontent.com/SillyCatty/revenge-performance-boost/main/
   ```
