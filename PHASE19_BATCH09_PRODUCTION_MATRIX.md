# Phase 19 Batch 09 Production Matrix — M81-M88

## Scope
Final campaign batch covering M81-M88. The browser implementation is a 2D prototype/reference layer. This batch closes the 88-mission campaign implementation while preserving the separation between prototype logic and final Unreal production.

| Mission | Runtime / State | Characters / Relationships | Police / World | Vehicle / Interior | Cinematic / Audio | Unreal production contract |
|---|---|---|---|---|---|---|
| M81 Last Preparation | 4-beat prep + persistent readiness | Darius/Malik/Amara readiness | final-operation pressure state | Safehouse + Workshop + Central | final-operation briefing + VO direction | three-character prep sequences, final kit props, animation/camera/audio cues |
| M82 No Loose Ends | cleanup + secure + clear state | Amara/Darius consequence checks | threat cleanup / fallback route | Central + Safehouse | cleanup montage / dialogue | threat actors, safehouse state variants, consequence staging |
| M83 The Final Route | evidence review + persistent route choice | Darius with Malik/Amara support | route risk state | Port route / vehicle approach | route-selection beat | route variants, traversal/vehicle staging, cinematic choice branches |
| M84 The Final Ledger | bank access + ledger integrity | Malik/Darius support | evidence exposure hooks | Central Bank | heist/extraction cues | bank interior, ledger prop, stealth/extraction animation |
| M85 Three Against The City | three-character coordination + climax | all protagonists | maximum conflict hooks | Tower + Port + Central | multi-location climax / VO | three protagonist rigs, synchronized gameplay/cinematics, crowd/police staging |
| M86 The Last Choice | persistent E1-E4 ending selection | final relationship/choice state | ending-dependent world flags | Central + Safehouse | final choice sequence | four ending branches, facial/body performance, camera/audio variants |
| M87 Dawn | aftermath + survivor/evidence assessment | survivor state | immediate aftermath | Family house + Central | dawn epilogue | survivor variants, lighting/time-of-day, cinematic performance |
| M88 Veyron After 404 | epilogue + world-state + free-roam unlock | final relationship state | ending-dependent district state | Central / post-game world | ending-specific epilogue | full post-game world-state variants and final cinematics |

## Required QA
- Every M81-M88 mission starts through the canonical playable mission runtime.
- Every mission advances through all four declared beats.
- M83 route choice persists before the final route beat.
- M86 persists one of the four authoritative endings: E1 The Escape, E2 The Crown, E3 The Sacrifice, E4 No Way Out.
- M87 records aftermath/survivor consequences.
- M88 applies ending-dependent world state and unlocks post-game free roam.
- Mission results persist and preserve the prerequisite chain.
- All existing Batch 01-08 validators remain passing.
- Browser temporary TTS remains explicitly non-final voice production.

## Production boundary
Not claimed complete here: final 3D character assets, facial/body animation, recorded voice acting, production cinematics, complete vehicle fleet/physics, full city/interiors/NPC population, authoritative online backend/anti-cheat, mobile certification and store release.
