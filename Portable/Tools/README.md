# Portable Project Contract

The portable layer is the long-term source of truth for 404: NO WAY OUT.

Keep these engine-neutral files authoritative:
- Portable/Data/*.json
- Portable/Schemas/*.json
- existing mission/world/economy/online JSON contracts

Unity, Unreal and Godot projects are consumers of this layer. Engine-native files may be generated from these contracts but must not become the only copy of gameplay/world rules.

## Asset interchange
- `.blend` is the editable master when Blender is used.
- `.glb/.gltf` is the preferred modern interchange format.
- `.fbx` is retained for broad DCC/engine compatibility.
- textures stay as standard image files.
- audio masters stay WAV; runtime compression can be engine-specific.

This does not mean one engine project can be opened directly by another. It means the important game data and source assets are deliberately structured so we can migrate engines without rebuilding the game design from zero.
