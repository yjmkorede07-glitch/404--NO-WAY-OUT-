# 404: NO WAY OUT

Unity production repository for **404: NO WAY OUT**.

## Production engine
- Unity **6.3 LTS**
- Universal Render Pipeline (URP)
- Addressables
- Unity multiplayer / authoritative-server architecture

## Repository rules
The repository is the source of truth. Do not restart the project from scratch or move individual source files between phases.

Generated Unity folders such as `Library/`, `Temp/`, `Obj/`, `Logs/`, and `UserSettings/` are intentionally ignored. Unity regenerates them when the project is opened.

## Project layout
- `Assets/404NoWayOut/` — Unity game content and runtime/editor code
- `Packages/` — Unity package manifest and lock file
- `ProjectSettings/` — Unity project configuration
- `Portable/` — engine-neutral contracts, schemas, and interchange assets
- `Docs/` — production documentation
- `Tools/` — validation/build helper scripts

## Current production lock
**Phase 54 — Pre-Editor Production Lock**

The active Unity project contains the cumulative work from Phases 36–54, including world layout, gameplay systems, missions, online architecture, backend contracts, Addressables content groups, cinematics, animation/facial runtime contracts, mobile profiles, and production gates. Historical Phase 34 and Phase 35 source/contracts are also preserved under `Legacy/` because they had not previously been uploaded to GitHub.

## Opening the project
Open the repository root (`unity404_phase54` or its renamed repository folder) with **Unity 6.3 LTS**.

Do not open the ZIP directly. Extract/clone the repository first.

## Important limitation
This repository has been structurally and statically validated in the preparation environment. Final Unity Editor compilation, Play Mode, asset import, lighting, device builds, GPU/CPU profiling, and live multiplayer testing must be performed after opening the project in a real Unity 6.3 LTS installation.

## Copyright / asset rights
Only ship assets, references, audio, voices, likenesses, fonts, and other content for which the project has appropriate rights. Temporary review-only references must not be packaged as final game content.
