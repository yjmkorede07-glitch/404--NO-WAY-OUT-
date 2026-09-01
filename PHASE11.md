# 404: NO WAY OUT — PHASE 11
## Mobile Gameplay Foundation + Cinematic Character Switching + Audible NPC Reactions

### Implemented in the browser prototype
- Floating virtual analog movement stick replacing the legacy arrow controls.
- Right-side touch look/camera pad as a presentation bridge for the future third-person camera.
- Contextual ACTION / ENTER / TALK / EXIT controls.
- Compact state chip for FREE ROAM, MISSION ACTIVE, DRIVING and wanted stars.
- Cinematic protagonist transfer overlay for Darius, Malik and Amara.
- Character switching preserves each protagonist's existing world position/state.
- Autonomous NPC proximity greetings without a Speak button.
- Bump reactions with personality-aware remarks and automatic player responses.
- Contextual reactions for suspicious encounters, help, hostility and vehicle/tire incidents.
- Browser SpeechSynthesis is used for audible prototype dialogue.
- NPC dialogue is presented as an audio cue by default; the spoken line is not required to be read as on-screen dialogue.
- Voice can be toggled from the HUD.
- Existing NPC memory/trust systems are updated by Phase 11 interactions.
- Existing vehicle tire reaction is connected to an audible nearby reaction when possible.
- Existing wanted-star display is retained.

### Prototype boundary
The browser version cannot provide production-quality mocap, facial animation, spatial voice, true third-person camera movement, or console-grade cinematic streaming. Those belong to the future Unreal implementation. The Phase 11 interfaces are deliberately designed so the same gameplay events can later call Unreal animation/audio/camera systems.

### Future Unreal implementation
- True third-person spring-arm camera.
- Camera-relative movement.
- Full virtual joystick plugin/input mapping.
- Context-sensitive action wheel.
- Character-specific facial animation and lip sync.
- Recorded actor/voice performances.
- Spatial 3D NPC audio.
- Cinematic world-space character switching with streaming/LOD.
- Camera travel across Veyron City to the selected protagonist.
- Character-specific switching transitions.
