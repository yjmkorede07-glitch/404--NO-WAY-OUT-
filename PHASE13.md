# 404: NO WAY OUT — PHASE 13
## Living Veyron City

Phase 13 upgrades the Build 012 browser prototype with a living-world layer.

### Implemented in the browser prototype
- NPC routine states: home, commute, work, shop, social, leisure.
- NPC destination anchors and movement between activities.
- NPC mood/energy/fear/suspicion drift.
- Spontaneous proximity/bump reactions.
- Audible ambient NPC reactions using the existing Phase 11 voice bridge.
- Traffic hazard reactions and nearby civilian remarks.
- World events such as traffic disruptions, arguments, emergency responses and suspicious activity.
- Wanted stars rendered as `★★★★★` / `☆☆☆☆☆`.
- Wanted state labels: CLEAR, SEARCHING, PURSUIT, HEAVY RESPONSE, MANHUNT.
- Existing crime/police incident data receives a Phase 13 bridge for story police-pressure consequences.
- CITY LIFE panel exposes NPC activity and recent world events.

### Preserved
Phase 3–12 systems remain in place. Phase 13 extends them rather than replacing them.

### Production 3D boundary
The browser still uses the existing 2D canvas prototype. Production Veyron requires Unreal Engine systems for:
- NavMesh/AI navigation
- animation state machines
- crowds and traffic physics
- 3D spatial audio
- physically simulated vehicles
- streamed interiors
- World Partition/LOD
- cinematic cameras and animation

### Suggested test
1. Open the game.
2. Tap `CITY LIFE`.
3. Move around and watch NPC activity change with the world clock.
4. Approach NPCs and listen for contextual speech.
5. Create a traffic/tire incident and observe reactions.
6. Confirm wanted stars display instead of a numeric wanted level.
