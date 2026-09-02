# Phase 36 — Unity Production Foundation

## Locked decisions
- Production engine target: Unity 6.3 LTS.
- World: 100% meaningful coverage target; 84% fully accessible target.
- Islands: Blackwater Island, Crown Isle, Redhaven Island, Solara Island, Gravesend Island, plus smaller islands.
- Controls: no universal E interaction. Actions are separately bound and rebindable.
- Doors: normal doors open automatically on approach; restricted doors evaluate access automatically; no button press for ordinary traversal.
- Online Force: applications are stored and reviewed through an admin workflow; NPC police remain active.

## First Unity implementation
- Runtime rules constants.
- Separate action input component.
- Automatic door component.
- World coverage registry.
- Loading state controller.
- Force application/review service.
- Protagonist reference asset type.
- Development scene builder menu.
- Migrated authoritative mission and system JSON under SourceOfTruth.

## How this becomes the real game
1. Open this project with Unity 6.3 LTS on a machine with enough storage.
2. Let Unity import packages.
3. Use `404 > Build Development Scene` to create the first test scene.
4. Replace the prototype scene with production World/character/vehicle assets as they are created.
5. Continue the implementation layer without rewriting the existing data contracts.

## Verification boundary
This package has been statically validated here. Unity editor compilation/runtime execution has NOT been run in this environment because the Unity editor is not installed here.
