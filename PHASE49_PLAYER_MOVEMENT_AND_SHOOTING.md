# Phase 49 — Player Movement & Shooting

Adds a production-ready third-person locomotion contract inspired by modern open-world action games: walk, jog, run, sprint, jump/fall, camera-relative movement, acceleration/deceleration, aim-walk, and shooting input.

Controls remain separate actions; no universal interaction key is introduced. Space is dedicated to jump, Right Mouse to aim, Left Mouse to fire, and Left Shift to sprint.

The runtime is engine-specific only at the Unity adapter layer. The control contract remains engine-neutral for future Unreal/Godot adapters.

This phase is structurally validated only; Unity Editor compilation/play-mode and final animation assets require the production workstation.
