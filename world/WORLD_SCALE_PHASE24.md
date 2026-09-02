# Phase 24 — World Scale, Mountains, Resort and Weather

## Locked map direction
Veyron is a large connected region rather than only a city. The final production map contains the existing eight districts plus North Range, Alpine Valley, Snowline Resort, Outer Highway, Rural Estates and Lakes Region.

## Exploration targets
- mountain highways and tunnels
- ski resort and alpine village
- forests and trails
- lakes and rural roads
- coastal drives
- industrial freight corridors
- island travel
- dense central city

## Streaming
World Partition is the primary runtime streaming solution. Interiors use data layers/level instances as appropriate. Loading screens are used only for genuine transitions or heavy operations; normal travel should remain seamless.

## Weather
Weather is simulation-driven and can transition gradually. Snow is a real world state: it accumulates, changes visibility and road handling, and can clear. The system is shared in Online where appropriate and deterministic/controlled in Story for authored moments.
