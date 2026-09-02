# Phase 28 — Universal Mission Cinematic System

## Locked direction
404: NO WAY OUT now treats cinematics as part of the mission grammar, not as rare exceptions.

Every authored **Story main mission** and **Online mission** has:
1. Opening cutscene before playable objectives.
2. Post-mission cutscene after resolution.
3. Optional in-mission cutscenes for authored story beats; major missions are flagged for them.

The same contract is mandatory for every future **side mission** before it is released.

## Unreal production implementation
Use Unreal Engine 5.6.x Level Sequence/Sequencer assets. The data catalogs in `Content/Data/Cinematics/` define stable sequence IDs and objective triggers; final `.uasset` sequences are produced on the development PC after Unreal and the original 3D/animation/audio assets are available.

## Online synchronization
The server owns mission state. Clients receive a cinematic start/state signal and resume marker. A late joiner receives the current mission state rather than forcing the group to replay a scene.

## Side missions
The cinematic contract is ready, but the existing source of truth does **not** contain a completed authored side-mission story catalog. Phase 28 therefore does not falsely claim those stories are finished; it enforces the cinematic requirement for them.
