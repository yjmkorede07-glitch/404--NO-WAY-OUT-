# Phase 31 — Dynamic World Simulation

This phase adds the engine-neutral contract and runtime foundations for making Veyron feel alive between missions.

## Core clock
- 1 in-game hour = 5 real minutes.
- 1 in-game day = 120 real minutes.
- Simulation ticks are decoupled from rendering.

## Systems
- NPC schedules: work, commute, leisure, home, sleep, emergency response.
- Traffic: district-aware density and time/weather modifiers.
- Police: patrol, dispatch, pursuit, search, recovery; NPC police remain active regardless of player lifestyle.
- Businesses: open/closed state, legal operations, optional off-book illegal activities, heat/evidence hooks.
- Properties: occupancy, ownership, construction state and world presence.
- Dynamic events: weighted street events, crime reports, accidents, business opportunities and social events.
- Weather/time: affects schedules, traffic, visibility and event weights.
- World-state events can feed mission prerequisites and post-mission consequences.

## Design rule
The world simulation never replaces authored missions. It supplies ambient activity and state changes around them.

## Multiplayer rule
Server authority owns persistent online simulation state. Clients may predict presentation only; rewards, arrests, evidence, business outcomes and persistent state are server validated.
