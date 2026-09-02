# Phase 45 — Portable Engine Contract

Phase 45 makes the project engine-portable at the source-of-truth level.

The production engine remains Unity 6.3 LTS, but the project now has an explicit engine-neutral contract so future migration to Unreal Engine or Godot does not require rewriting the game's world, missions, economy, online identity, or core asset organization from scratch.

## What is portable
- world/district/POI identifiers
- mission definitions and state rules
- online player/character/economy contracts
- controls as stable action IDs
- asset naming and interchange conventions
- coordinate/unit conventions
- source 3D assets through standard interchange formats

## What is not magically portable
Engine-specific shaders, prefabs, scenes, Blueprints, Animator Controllers, networking implementations, plugins, lighting data and UI layouts still require an adapter for each engine.

## Production rule
Unity remains the primary production runtime. Unreal and Godot are supported migration targets, not simultaneous production runtimes.
