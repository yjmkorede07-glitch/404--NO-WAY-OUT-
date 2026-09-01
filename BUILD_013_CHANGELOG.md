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


## Session verification / integration hardening
- Fixed Phase 18 scheduler clock-domain mismatch: `performance.now()` is now used consistently for world/NPC/business simulation cadence.
- Phase 18 now mirrors the visible browser weather state instead of running a competing weather clock.
- Throttled player movement persistence to 250 ms to reduce unnecessary mobile `localStorage` writes while preserving save behavior.
- Added `tools/validate_build013.js` for mission/status data-contract validation.
- Added `Unreal/` migration skeleton with mission and world-simulation C++ data contracts plus handoff notes.
- Re-ran JavaScript syntax validation and JSON validation successfully.


## Phase 19 — Batch 01 production batching
- Adopted a 10-mission production cadence instead of treating all 88 missions as one undifferentiated build.
- Added `phase19_batch01.json` covering M01-M10 with required systems, story beats and mission-specific QA gates.
- Added `js/phase19.js` with a browser production-batch panel, replay/start controls and persisted batch completion gate.
- Added `PHASE19.md` documenting the batch strategy and subsequent batch ranges.
- Phase 19 remains a 2D browser vertical-slice layer plus Unreal migration contracts; it does not claim finished 3D production.

## Phase 19 Batch 01 — M01-M10 implementation pass
- Added mission-specific runtime contracts for M01-M10 rather than relying only on generic objective advancement.
- Added persistent Phase 19 mission checkpoints/action counters and batch completion state.
- Added mission-specific interactions for the opening investigation, bank evidence, three-name investigation, Amara call, Central route, North Hills observation, Reed Workshop cooperation, port container/escape, three social contacts, and Amara's three-part information synthesis.
- Expanded M05 route objectives to explicitly cover Central Bank, East Market, Police HQ and Darius Safehouse.
- Expanded M08 into container inspection plus port escape actions.
- Added per-mission production contracts covering cinematic beats, audio/VO, art/world hooks, animation, NPC/AI, failure modes, save points, scoring and persistence.
- Added `tools/validate_phase19_batch01.js` for static Batch 01 production-gate validation.
- Validation: 88 missions intact, M01-M10 mapped, JSON valid, all JavaScript/server syntax valid, Build 013 validator PASS, Phase 19 Batch 01 validator PASS.
