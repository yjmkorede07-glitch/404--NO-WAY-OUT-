# 404: NO WAY OUT — Storage Estimate

These are planning ranges, not a promise of an exact final install size. Compression, texture resolution, audio codec, LOD strategy, platform and downloadable content can move the result substantially.

## PC/console-class target
- Development source/cache/project: **150–300+ GB** recommended working space once DCC source files, Unreal Derived Data Cache and packaged builds are included.
- Final installed game target: **45–80 GB** for a first production release is a sensible planning range.
- High-fidelity PC build with very large texture/audio/cinematic packages: **80–110+ GB** is possible.

## Mobile target
A separate mobile content budget should be maintained rather than simply shrinking the PC build.
- Initial mobile package target: **15–25 GB**.
- Larger high-end mobile package: **25–35 GB** if device tiers and optional downloads are used.

## Why the number grows
The biggest storage consumers will be original environment textures/meshes, character variants and animation, vehicle assets, recorded VO, cinematic video/sequence data, light/build data and platform-specific packaged content.

## Important current-machine implication
The current low-storage machine is suitable for planning/source editing, but it is not a practical final Unreal build machine. A development machine with substantially more free storage is required. **300 GB+ free** is a comfortable starting point for production work, even if the eventual shipped game is much smaller.
