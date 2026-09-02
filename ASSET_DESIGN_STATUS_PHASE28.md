# 404: NO WAY OUT — Asset Design Status

## What is already designed
The project already has production-facing design/source data for:
- **Characters:** Darius Cole, Malik Reed, Amara Vale, supporting NPC/dialogue references, protagonist switching and character runtime contracts.
- **Map/world:** Veyron Central, East Market, North Hills, Iron District, West Coast, Airport, Port, Blackwater Island plus expanded North Range, Alpine Valley, Snowline Resort, Outer Highway, Rural Estates and Lakes Region; district/POI/world-integration registries exist.
- **Vehicles:** vehicle ownership/economy contracts, starter vehicles, vehicle-theft systems and vehicle categories exist; final model roster and individual 3D meshes are still production work.
- **Interiors:** the existing interior registry includes Veyron Bank, Darius Safehouse, Central Market, Police HQ, Reed Workshop, Lena's Cafe, Port Warehouse 7 and Airport Terminal.
- **Missions/cinematics:** 88 story missions and 24 authored online missions are registered; Phase 28 adds the opening/in-mission/post-mission cinematic grammar.

## What is NOT already finished
The repository does **not** contain final production-quality 3D character meshes, facial rigs, clothing variants, vehicle meshes, complete environment art, animation libraries, final VO, cinematic Sequencer assets, or mobile-optimized packaged content. Those must be produced/imported and tested in Unreal.

## Recommended production toolchain
Unreal remains the final game engine. Other software can be used alongside it:
- Blender: modeling, UVs, rigging, asset cleanup.
- Substance 3D Painter/Designer: materials and texture authoring.
- Houdini: procedural roads, buildings, terrain and large-scale environment generation where useful.
- Marvelous Designer: clothing simulation/garment authoring if needed.
- Audition/Reaper or equivalent: voice/audio cleanup and editing.
- Unreal Engine 5.6.x: final assembly, gameplay, Sequencer cinematics, lighting, optimization, packaging and online client.

Using another 3D tool does **not** remove the need for a game engine. Blender/Houdini can make the assets; Unreal is still the recommended final runtime for this project.
