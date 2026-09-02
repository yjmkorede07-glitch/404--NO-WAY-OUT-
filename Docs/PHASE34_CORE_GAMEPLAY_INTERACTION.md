# Phase 34 — Core Gameplay Interaction

This phase connects the simulation systems into reusable physical-world interactions.

## Player loop
Approach target → interaction prompt → range/permission validation → action → world consequence.

## Law enforcement
Accepted player officers use the same interaction family as NPC police: plate checks, Citizen ID checks, detain/arrest, backup, ambulance, fire and tow requests. NPC police remain active.

## Mission cinematic contract
Every mission follows opening cinematic → gameplay → optional in-mission cinematic beats → gameplay → resolution → post-mission cinematic. The flow is data-driven so a solo developer does not manually assemble every mission from scratch.

## Online authority
Clients request actions; the server validates identity, role, range, ownership, balance and world state before applying persistent consequences.

## Engine strategy
Godot remains the lightweight candidate for the current PC test. Unreal remains supported as the high-end target. No irreversible migration is made until the hardware test.

## Shipping targets
Mobile: 3–5 GB target. PC/console: 40–100 GB planning range.
