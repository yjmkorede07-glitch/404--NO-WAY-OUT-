# 404: NO WAY OUT — Build 012 / Phase 10

Build 012 is an integration upgrade on top of Build 011 Finale. Existing systems are preserved.

## 14 upgrades
1. Documentation reconciliation: 88-mission campaign is the source of truth; stale 34-mission language is marked for correction.
2. Enriched 88-mission architecture: every mission receives a shared contract for protagonist, NPCs, location, objectives, scoring, rewards, consequences, flags, dependencies and unlocks.
3. Conditional four endings: A Escape, B Crown, C Sacrifice, D No Way Out now have state-driven conditions and post-game effects.
4. Mission scoring/retry: runtime start/finish state, attempt counter, result persistence and functional retry path.
5. Natural NPC reactions: proximity-driven bump reactions without requiring a talk button for every encounter.
6. Witness/police consequences: crime reports now feed world heat and wanted pressure through the existing witness foundation.
7. Tire/vehicle reaction chain: tire pop updates pressure, handling penalty, vehicle state and driver distress.
8. Building registry: meaningful buildings have access tiers, floors, districts and mission connections.
9. Multi-floor property framework: selected properties expose floor/room structures.
10. Hotel system: reception booking, payment, room assignment and room access state.
11. Character/cinematic bible: Darius, Malik and Amara visual, mannerism and voice direction is codified.
12. Prototype/future-engine boundary: browser implementation is clearly separated from future full 3D/Unreal and production multiplayer work.
13. Post-game world state: endings alter free-roam law/activity/district states.
14. Story/Online separation: explicit mode state prevents silently treating campaign progression as online progression.

## Important reality check
The browser build remains a 2D gameplay prototype. Build 012 does not falsely claim to be a PS4-quality 3D game. A production-scale 3D version should migrate the gameplay contracts to a real engine. Unreal Engine's World Partition is designed for distance-based streaming of large worlds, with HLOD and other world-management features. See the official Epic documentation for the future-engine implementation plan.
