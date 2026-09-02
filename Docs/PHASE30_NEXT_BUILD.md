# Phase 30 — Veyron Credit Sign + Production Engine Decision Gate

## Currency sign
The game now has an actual visual currency sign, separate from the code VCR.
VCR is retained only as the text/accessibility fallback. The visual mark is an original angular glyph and must not be confused with $, €, £, ¥, or ₦.

## Engine decision gate
Godot 4.7 remains the lightweight alternative candidate. Unreal 5.6 remains the production reference until the current-PC Godot compatibility test is actually run. No migration is claimed yet.

## Next production priorities
1. World simulation: NPC schedules, traffic, police, businesses, properties, dynamic events.
2. Online onboarding persistence and admin acceptance backend.
3. Mission cinematic registry for story, side, and online missions.
4. Character/voice/photo intake pipeline.
5. Representative 3D performance test on the user's current PC before engine lock.
