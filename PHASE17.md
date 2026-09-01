# 404: NO WAY OUT — PHASE 17
## Dynamic Relationships + Mission Triggers + World Simulation + Aim/Controller

### Implemented now
- Mission start triggers:
  - walk into a marker
  - approach a named NPC
  - receive/answer a phone call
- Incoming call queue and answer/decline state.
- Audible dialogue bridge for NPCs and calls.
- Personality-aware contextual NPC responses.
- Relationship trust and affection state.
- Dynamic interaction memory timestamp.
- Soft auto-aim target selection contract with range/assist state.
- Gamepad detection through the browser Gamepad API.
- Standard controller axes and action-button mapping.
- Touch/keyboard fallback remains available.
- Tiered world simulation contract for traffic, crowds, business activity and emergency pressure.
- World/relationship UI panel.

### Controller direction
Recommended final controls:
- Left stick: movement
- Right stick: camera/aim
- RT: fire
- LT: aim
- A/Cross: interact/enter vehicle
- X/Square: reload/use
- B/Circle: crouch/exit
- Y/Triangle: character/vehicle context
- D-pad: quick actions
- View/Select: map
- Menu/Start: pause
The browser prototype reads standard gamepad input; full controller support belongs in the Unreal Enhanced Input system.

### Auto-aim direction
Use a GTA-like optional soft-lock rather than a hard lock:
- nearest valid target in cone
- distance and line-of-sight weighting
- target switching with right-stick input
- aim assist strength settings
- separate on-foot and vehicle tuning
- no automatic shooting

### Important production boundary
This phase does not claim a full GTA-style 3D controller, skeletal targeting, hit reactions, police AI, voice acting, or multiplayer networking in HTML. Those require Unreal Engine and backend services.
