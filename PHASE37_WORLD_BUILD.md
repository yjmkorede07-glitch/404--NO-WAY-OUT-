# PHASE 37 — UNITY WORLD BUILD

Phase 37 turns the approved world-layout specification into an executable Unity greybox foundation.

## Locked targets
- 100% meaningful world coverage.
- 84% fully accessible meaningful coverage.
- Mainland + five major islands + eight minor islands planned.
- 13 named mainland regions.
- Roads, airport, port, rail, ferries, marinas and docks are world systems, not decorative map labels.
- Physical-world-first interaction remains the rule.
- No universal E interaction.
- Ordinary doors open automatically when approached; restricted doors resolve authorization/state automatically.

## Built in this phase
- `world_layout_v3.json` authoritative spatial plan.
- `WorldLayoutTypes.cs` region definitions.
- `WorldStreamController.cs` runtime distance streaming foundation.
- `WorldGreyboxBuilder.cs` editor builder for the first playable world greybox.
- Phase 37 scene output path: `Assets/404NoWayOut/Scenes/404_Veyron_Phase37_Greybox.unity` after running `404 > Build Phase 37 World Greybox` in Unity Editor.
- World layout concept reference image.

## Important production boundary
The greybox is intentionally lightweight. It is not the final art pass. Final terrain, roads, buildings, interiors, vegetation, vehicles, characters, materials, lighting, animations and optimized streaming content are still production-asset work.

## Validation
Static JSON parsing and C# structural checks must pass in the build environment. Unity editor compilation/runtime must be verified on the production PC because Unity is not installed in this current environment.
