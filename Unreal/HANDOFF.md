# 404: NO WAY OUT — Build 013 / Phase 18 Unreal Skeleton

This is a **data-contract skeleton**, not a compilable Unreal project by itself.

Purpose:
- lock the migration boundary from the verified browser prototype to Unreal Engine 5.x
- keep mission data-driven
- provide stable contracts for World Simulation and mission scoring/relationships

Next Unreal implementation:
1. Create a UE 5.x C++ project named `NoWayOut`.
2. Add the `NoWayOut` module and reflected headers under `Source/NoWayOut/Core`.
3. Add `GameplayTags` and any required engine modules to the `.Build.cs`.
4. Create one Primary Data Asset per mission from `campaign_88_missions.json`.
5. Add GameInstance subsystems for relationships, missions, world simulation, police, economy, save and online.
6. Migrate JSON prerequisites/consequences into Gameplay Tags and SaveGame state.
7. Keep Story Mode and authoritative Online architecture separate.

The browser remains the verified 2D prototype; this skeleton does not claim 3D production completion.
