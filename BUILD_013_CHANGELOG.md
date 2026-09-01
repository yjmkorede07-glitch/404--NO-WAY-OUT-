# Build 013 — Phase 18 Changelog

## Audit
- Started from the user-supplied Build 012 Phase 17 archive.
- Preserved existing JavaScript, JSON, server, mission and UI layers.
- Verified the archive contains an 88-mission campaign registry and a browser-playable campaign framework.
- Kept the production boundary explicit: the browser remains a 2D prototype.

## Phase 18 — Final Integration Layer
- Added `js/phase18.js`.
- Added persistent protagonist relationship state and interaction deltas.
- Added a dynamic 88-mission lead/trigger graph derived from the campaign registry.
- Added available/locked/discovered mission states.
- Added world simulation state for traffic, crowd density, emergency pressure and business activity.
- Added weather transitions and intensity.
- Added lightweight dynamic world events.
- Added tiered NPC simulation representation (`near`, `district`, `aggregate`).
- Added witness → report → dispatch → investigation → search → identification → pursuit police-case contract.
- Added mission-completion consequence bridge.
- Added a Phase 18 World Sim UI panel.
- Added mobile-safe styling for the new panel.
- Added Phase 18 to the HTML boot sequence.

## Production boundary
Phase 18 does not claim to implement a console-scale 3D world in HTML/JavaScript. The same state contracts can be consumed by a future Unreal Engine implementation and an authoritative backend.
