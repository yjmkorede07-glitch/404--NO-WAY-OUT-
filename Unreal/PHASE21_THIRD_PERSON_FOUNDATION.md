# 404: NO WAY OUT — Phase 21 Third-Person Foundation

## Goal
Turn the Phase 20 Unreal architecture into a playable third-person shell without replacing the authoritative 88-mission data.

## Implemented in this package
- `ANOWAYOUTGAMEMODE`: selects the project PlayerController, PlayerState, GameState and character classes.
- `ANOWAYOUTGAMESTATE`: replicated active mission, protagonist, ending and free-roam state.
- `ANOWAYOUTPLAYERSTATE`: replicated active protagonist.
- `ANOWAYOUTPLAYERCONTROLLER`: game-only input mode.
- `ANOWAYOUTCHARACTER`: third-person movement, mouse camera, protagonist switch actions (1/2/3).
- `UNOWAYOUTPROTAGONISTSUBSYSTEM`: persistent active protagonist state with save hook.
- `UNOWAYOUTPROTAGONISTDATAASSET`: production data contract for Darius, Malik and Amara meshes/animation.
- `ANOWAYOUTGREYBOXVEYRONCENTRAL`: runtime greybox seed so a blank startup map can immediately show a basic Veyron Central test space.
- Default GameMode and desktop input mappings.

## Intentional limitations
This is a foundation, not final art. Character meshes, animation sets, vehicles, world art, interiors, cinematics, VO, backend and mobile certification still require production work.

## First PC run
1. Install UE 5.6.x (the project was authored against 5.6; 5.6.1 is acceptable).
2. Open `NoWayOut.uproject`.
3. Let Unreal generate project files and compile the C++ module.
4. Press Play.
5. WASD moves; mouse controls camera; 1/2/3 requests protagonist switching.
6. If Unreal reports a compiler/API issue, send the exact first error line and file/line number.

Do not create a new Unreal project. Do not replace the source registry.
