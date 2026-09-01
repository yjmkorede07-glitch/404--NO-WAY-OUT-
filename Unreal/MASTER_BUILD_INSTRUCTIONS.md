# 404: NO WAY OUT — MASTER BUILD & PRODUCTION INSTRUCTIONS

## Purpose
This is the exact execution manual for completing the game from the current portable preparation package to a releasable Unreal Engine game.

## Golden rule
The assistant builds the project files, code, data contracts, validation tools, templates, manifests, mission data, systems, and integration scaffolding whenever those can be produced without the user's hardware.

The user only performs actions that require a real PC/device/account/person, and follows the numbered instructions below. Never invent a completed asset or claim final release readiness before it is actually tested.

---

# PART A — WHAT YOU ALREADY HAVE

The portable package already contains the existing Build 013 work, the 88-mission campaign data, four endings, browser prototype systems, Unreal production foundation, protagonist framework, mission architecture, world simulation architecture, relationship/economy/police/save foundations, and production documentation.

The 88 missions remain the authoritative campaign registry. Do not renumber them.

---

# PART B — THE ONE-TIME PC SETUP

## B1. Required hardware

Use a Windows PC with enough free storage for Unreal Engine, Visual Studio/build tools, the project, DerivedDataCache, source assets, packaged builds, and backups. A 58.2 GB internal drive is not enough for this workflow.

## B2. Install Epic Games Launcher

1. Download Epic Games Launcher from Epic's official website.
2. Install it.
3. Sign in.

## B3. Install Unreal Engine

1. Open Epic Games Launcher.
2. Unreal Engine > Library.
3. Add an engine version.
4. Select Unreal Engine 5.6.1.
5. Install it to a drive with substantial free space.
6. Do NOT create a blank project.

## B4. Build tools

Install the Visual Studio version/components required by Unreal Engine 5.6.1 for C++ development. During installation include the C++ desktop/game-development tooling and Windows SDK required by the Unreal documentation.

## B5. Put the project on the PC

1. Copy the complete `404-NO-WAY-OUT-Build-013-Portable-Production-Prep.zip` to the PC.
2. Extract it to a permanent development folder, for example:
   `D:\Games\404-NO-WAY-OUT\`
3. The Unreal project is inside:
   `phase19batch09work\Unreal\NoWayOut.uproject`
4. Keep the folder structure intact.
5. Do not rename the Unreal project folder or `.uproject` file.

## B6. First compile

1. Double-click `NoWayOut.uproject`.
2. Allow Unreal to generate project files/build dependencies if prompted.
3. Let the initial C++ compilation finish.
4. If Unreal reports an error, copy the COMPLETE error text and send it to the assistant. Do not randomly change source files.

---

# PART C — PHASE ORDER

The production order is locked unless a real technical blocker requires a change.

1. Compile Phase 20/21 foundation.
2. Establish the playable third-person character loop.
3. Replace the simple greybox with the World Partition Veyron Central foundation.
4. Import production Darius/Malik/Amara characters.
5. Add locomotion, interaction, camera, switching and animation.
6. Connect mission actors/objectives to the mission subsystem.
7. Implement the full objective-type runtime.
8. Implement mission scoring and consequences.
9. Build interiors and mission streaming.
10. Build vehicles and traffic.
11. Build NPC/AI and police.
12. Build cinematics, VO, music and sound.
13. Finish save/load and ending persistence.
14. Finish post-M88 free roam.
15. Build authoritative online mode separately from Story Mode.
16. Optimize for mobile.
17. Run device QA.
18. Package release builds and complete store requirements.

---

# PART D — EXACT USER ACTIONS FOR 3D CHARACTERS

The assistant will provide the character data contracts, sockets, gameplay hooks, asset naming rules and integration code.

For each protagonist, the external production task is:

## D1. Character model

Create or commission an ORIGINAL fictional 3D model for:
- Darius Cole
- Malik Reed
- Amara Vale

Do not use copyrighted game characters or ripped assets.

## D2. Deliverables for each character

Create:
- body mesh
- head/face mesh
- hair
- clothing set
- materials/textures
- skeleton/rig
- facial rig or compatible facial animation system
- LODs
- collision/physics assets as needed

## D3. Folder placement

After the assistant provides the final character asset contract, put imported assets under:
`Content/Characters/Darius/`
`Content/Characters/Malik/`
`Content/Characters/Amara/`

Do not guess asset names. Use the naming manifest supplied by the assistant for the current phase.

## D4. Import sequence

1. Open Unreal.
2. Import the character mesh.
3. Import skeleton/rig assets.
4. Import materials/textures.
5. Import animation assets.
6. Assign the character to the appropriate protagonist data asset.
7. Run the supplied character validation checklist.
8. Test movement, camera, collision and switching.

If an importer asks about skeleton selection, do not guess. Send a screenshot and the assistant will tell you which asset to select.

---

# PART E — EXACT VOICE RECORDING WORKFLOW

Voice recording is one of the few tasks that cannot be completed merely by writing files. The assistant can prepare the dialogue script, line IDs, character direction, recording order, filenames, metadata and integration manifest. A human voice performer must record the audio.

## E1. Before recording

The assistant supplies a VO manifest containing:
- character
- line ID
- mission
- scene
- emotional direction
- exact spoken line
- filename
- language
- take requirements

## E2. Recording setup

Use a quiet room and a decent microphone/interface if available. Record clean, unprocessed voice. Keep the microphone position consistent.

Recommended source format:
- WAV
- mono for dialogue unless a specific scene requires otherwise
- 48 kHz
- 24-bit
- no clipping
- no background music
- no heavy effects printed into the source

## E3. Record in batches

For example:
`Darius_M01_001.wav`
`Darius_M01_002.wav`
`Malik_M13_001.wav`
`Amara_M10_001.wav`

The exact filename comes from the manifest; never invent a different line ID.

## E4. Multiple takes

Record at least two usable takes for important cinematic lines. Mark the preferred take in the delivery manifest.

## E5. Delivery

Put approved files into:
`Content/Audio/VO/Raw/`

Then the assistant's integration pass will define the final location, naming, subtitles, dialogue data and runtime references.

## E6. Editing

For each approved line:
1. Remove accidental noise/silence.
2. Preserve natural performance pauses required by the scene.
3. Normalize consistently as part of the project's final audio pipeline.
4. Export the approved WAV.
5. Run the VO validation checklist.

Do not replace missing lines with silent placeholder files and call them complete.

---

# PART F — EXACT VEHICLE WORKFLOW

For each original vehicle:

1. Obtain/create the original 3D model.
2. Create optimized mesh/LODs.
3. Create materials.
4. Create collision/physics assets.
5. Add wheel/vehicle rigging.
6. Add driving/handling configuration.
7. Add damage states where required.
8. Add enter/exit sockets.
9. Import under:
   `Content/Vehicles/<VehicleName>/`
10. Register the vehicle in the vehicle data registry.
11. Test player entry/exit.
12. Test driving.
13. Test traffic integration.
14. Test mission spawning.
15. Test mobile performance.

The assistant will build the runtime architecture; the physical asset still needs to exist.

---

# PART G — WORLD / CITY WORKFLOW

Veyron City remains the original fictional city with these districts:
- Veyron Central
- East Market
- North Hills
- Iron District
- West Coast
- Airport
- Port
- Blackwater Island

## G1. World creation

1. Open the Unreal project.
2. Create/open the project's World Partition world supplied by the assistant.
3. Keep world origin/coordinate conventions defined by the current world manifest.
4. Build roads, blocks, landmarks and district boundaries according to the world registry.
5. Assign Data Layers.
6. Configure HLOD.
7. Configure streaming sources.
8. Add interiors as Level Instances/streamed content according to the integration manifest.

## G2. Building states

Every building is classified as:
- FULL
- CONDITIONAL
- BACKGROUND

Do not make a building FULL merely by adding a door. FULL means the interior and gameplay requirements are actually implemented.

## G3. Existing named interiors

The production list includes:
- Veyron Bank
- Darius Safehouse
- Central Market
- Police HQ
- Reed Workshop
- Lena's Cafe
- Port Warehouse 7
- Airport Terminal

Additional interiors are added only through the authoritative world/mission data.

---

# PART H — MISSION IMPLEMENTATION WORKFLOW

All 88 missions use the existing authoritative registry.

For each mission:

1. Create/refresh its mission data asset.
2. Place required mission actors in the world.
3. Assign objective IDs.
4. Configure objective trigger volumes/interaction points.
5. Configure supporting NPCs.
6. Configure vehicles.
7. Configure dialogue.
8. Configure cinematic references.
9. Configure optional objectives.
10. Configure score rules.
11. Configure relationship consequences.
12. Configure economy consequences.
13. Configure police consequences.
14. Configure failure conditions.
15. Configure success conditions.
16. Test the mission from a clean save.
17. Test failure/retry.
18. Test branching choices.
19. Test save/load during and after the mission where supported.
20. Test the mission in sequence with its prerequisites.

## Required objective runtime types

The runtime must support:
- move
- interact
- collect
- follow
- drive
- combat
- stealth
- survive
- escape
- choice
- cinematic

---

# PART I — MISSION SCORING

Use the existing scoring contract:
- Critical: 50
- Optional: 20
- Time: 10
- Survival/damage: 10
- Precision/stealth/accuracy: 10

Rank:
- 90–100 Exceptional
- 75–89 Excellent
- 60–74 Passed
- 40–59 Barely Passed
- 0–39 Failed

Never replace this with a different scoring system without updating the authoritative data and tests.

---

# PART J — RELATIONSHIPS / CONSEQUENCES

Mission completion must be able to affect:
- trust
- affection
- loyalty
- mission availability
- mission assistance
- dialogue
- consequences
- endings
- betrayal
- cooperation

The assistant will wire these through the existing relationship subsystem and mission consequence contracts.

---

# PART K — POLICE / NPC / AI

## NPC tiers

Use simulation tiers so the city does not simulate every NPC at maximum detail.

Implement/test:
- civilian navigation
- schedules
- ambient activity
- traffic
- mission NPC behavior
- combat AI
- witness behavior
- police investigation
- pursuit
- escalation
- case-chain consequences

Police wanted levels remain 0–5:
- Clear
- Suspicious
- Searching
- Pursuit
- Heavy Response
- Manhunt

---

# PART L — CINEMATICS

For each cinematic:

1. Create a Sequencer asset.
2. Add character tracks.
3. Add animation tracks.
4. Add facial performance where required.
5. Add camera cuts.
6. Add dialogue/VO.
7. Add music and sound.
8. Add environmental effects.
9. Add subtitle data.
10. Test transition into and out of gameplay.
11. Test skip behavior where the mission allows skipping.
12. Test save-state consequences.

The assistant will create reusable cinematic templates and data contracts before mass production.

---

# PART M — AUDIO

Required categories:
- protagonist VO
- NPC VO
- mission dialogue
- ambient city
- traffic
- weapons/combat where applicable
- police
- interiors
- footsteps
- UI
- mission stingers
- music
- ending music

The assistant will provide naming and integration rules. Human-recorded/commissioned audio is required for final production VO and any custom music/performance work.

---

# PART N — SAVE / ENDINGS / FREE ROAM

The save system must persist:
- mission states
- mission results
- relationships
- economy
- police/world state where appropriate
- protagonist state
- ending selection
- post-game unlock

Final ending mapping remains:
- A → E1 The Escape
- B → E2 The Crown
- C → E3 The Sacrifice
- D → E4 No Way Out

M88 unlocks post-game free roam with ending-dependent world state.

---

# PART O — ONLINE MODE

Online is separate from Story Mode.

Required production pieces:
- authoritative server
- replication/relevancy
- matchmaking/session management
- persistent account data
- economy persistence
- property persistence
- reconnect handling
- validation
- anti-cheat/security
- backend services
- parties/friends
- co-op missions
- heists
- races/events/competitive modes
- voice chat as appropriate

Do not treat browser JavaScript as secure multiplayer infrastructure.

The assistant can build schemas, server contracts, validation logic, integration code and deployment documentation. Actual hosted infrastructure/accounts/credentials must be supplied and operated externally.

---

# PART P — MOBILE

Targets:
- iOS
- Android

Build channels:
1. Development
2. QA
3. Release Candidate
4. Production

Device tiers:
- Low: 30 FPS target with reduced visual complexity
- Mid: 30 FPS balanced
- High: 45/60 FPS only where sustained thermal performance allows

Optimization order:
1. Gameplay correctness
2. Memory/streaming stability
3. CPU simulation
4. GPU performance
5. Battery/thermal stability
6. Visual fidelity

Desktop testing does not certify mobile performance.

---

# PART Q — QA CHECKPOINTS

Every major system must have:
- clean install test
- fresh-save test
- save/load test
- regression test
- failure/retry test
- controller/input test
- mobile input test
- performance test where relevant

Every mission must be tested in sequence and individually.

Every ending must be reached from controlled test saves.

Online requires separate server/client test environments.

---

# PART R — RELEASE CHECKLIST

The game is NOT called complete until all of these are true:

[ ] Unreal project compiles cleanly.
[ ] Story Mode launches.
[ ] All 88 missions are playable in 3D.
[ ] All required mission branches work.
[ ] All four endings work.
[ ] Free roam unlocks after M88.
[ ] Three protagonists work in their intended missions.
[ ] Save/load survives the full campaign.
[ ] Characters are final production assets.
[ ] Animation is final enough for release.
[ ] World/interiors are complete to the planned scope.
[ ] Vehicles are implemented and optimized.
[ ] NPC/AI works.
[ ] Police works.
[ ] Economy/property loops work.
[ ] Cinematics work.
[ ] VO/music/sound are complete for release scope.
[ ] Online server/backend works if included in release.
[ ] Mobile builds run on the target device matrix.
[ ] Performance budgets are met.
[ ] Crash/error testing is complete.
[ ] iOS release requirements are complete if shipping iOS.
[ ] Android release requirements are complete if shipping Android.
[ ] Store compliance/submission is complete.

Only then should the project be labelled RELEASE CANDIDATE / COMPLETE.

---

# PART S — HOW THE USER SHOULD WORK WITH THE ASSISTANT

At every stage:

1. The assistant says what has been built.
2. The assistant provides the exact file/package to use.
3. The assistant gives numbered instructions with exact folder paths and clicks.
4. If a human task is unavoidable (voice recording, external 3D modelling, account creation, device test), the assistant gives the exact deliverable, format, filename and destination.
5. The user performs only that external action.
6. The user reports the result or uploads the asset.
7. The assistant integrates and validates it.
8. The assistant produces the next package.

The user should never have to guess where an asset goes, what it should be named, what settings to use, or which Unreal option to select. If the assistant has not specified it, the user should stop and ask rather than improvising.

---

# CURRENT STATUS

Current package status: portable production preparation.

The project has a real Unreal foundation but has NOT been truthfully declared a finished 3D game. Final 3D art, animation, voice/audio production, complete world construction, complete mission execution, online infrastructure, real-device QA and store release still require implementation/testing.

The next implementation phase after the PC becomes available is the playable third-person Unreal loop, followed by world/mission implementation in the locked order above.
