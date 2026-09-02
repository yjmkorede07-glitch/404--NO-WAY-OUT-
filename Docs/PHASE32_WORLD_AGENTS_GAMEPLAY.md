# Phase 32 — World Agents & Gameplay Architecture

This phase turns the Phase 31 simulation rules into concrete runtime coordination for pedestrians, vehicles, police, businesses and dynamic events.

## Core rule
The player should experience a living world without requiring every NPC to exist at full simulation cost. Agents near the player receive full behavior; distant populations are represented by lightweight state and only promoted when needed.

## Police
NPC police remain active for every lifestyle. Incidents progress through dispatch, response, arrival, pursuit/search, arrest/recovery and clear. Active pursuits and mission actors are protected from normal despawn.

## Businesses
A legitimate business remains legitimate. Authorized off-book activities are optional and can create heat/evidence without automatically destroying the business.

## Missions
Story missions, side missions and Online authored missions share the same physical world simulation. Opening/in-mission/post-mission cinematics may temporarily lock or patch world state.
