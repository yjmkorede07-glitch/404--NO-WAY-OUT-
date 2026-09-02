# PHASE 38 — CORE PLAYER + WORLD GAMEPLAY

Phase 38 converts the Unity foundation into an executable gameplay layer.

## Built
- Third-person CharacterController movement and sprint.
- Third-person orbit camera.
- Darius/Malik/Amara runtime switching.
- Dedicated keyboard actions; no universal E.
- Contextual interaction targets for talk, vehicle, robbery, detain, arrest, mission and boarding.
- Automatic door behavior remains physical-world-first.
- Basic drivable development vehicle with tire damage/traction penalty.
- NPC world agents with civilian/police archetypes.
- Wanted-star runtime state foundation.
- Mission trigger foundation.
- Automatic entrance component.
- Runtime development world builder using Unity primitives so the project can be play-tested before final 3D art.

## Locked map/accessibility rules
- 100% of the intended world is meaningful.
- 84% of meaningful world is fully accessible/interactable.
- Five major islands plus mainland and minor islands remain in the world plan.

## Validation boundary
Static C# structural validation and JSON parsing are performed in this build environment. Unity Editor compilation/play-mode must be verified on the production PC because the Unity editor is not installed here.
