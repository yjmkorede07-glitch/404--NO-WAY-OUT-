# 404: NO WAY OUT — PHASE 12
## Veyron City 3D Vertical-Slice Presentation Bridge

### Implemented in browser prototype
- Branded startup/loading screen before gameplay.
- Progressive loading presentation with world/story/character/economy stages.
- First-boot detection using localStorage.
- First-time cinematic introduction to Veyron City and the mysterious 404 network.
- Audible first-boot welcome using browser speech synthesis when available.
- Skip Intro control on first boot.
- Subsequent launches skip the introduction and load directly into the saved prototype state.
- Explicit reset hook: `phase12ResetFirstBoot()` for development testing.

### Canonical opening
The established story opening remains M01 — First Night: Darius arrives at Veyron International Airport, takes a cab and returns to the Cole family house. Phase 12 does not replace that mission; the startup cinematic is a pre-game world/company introduction that hands off into Story Mode.

### Production 3D boundary
The browser still uses the existing 2D canvas world. The loading screen and cinematic are a presentation bridge. The production version should use Unreal Engine level streaming/World Partition, real cinematic cameras, recorded voice performances, facial animation, authored music and seamless asset streaming.
