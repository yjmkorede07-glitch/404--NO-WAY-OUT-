404: NO WAY OUT — Build 006
PHASE 5 + ONLINE SYNCHRONIZATION

PHASE 5:
- Vehicle classes/data
- vehicle body/engine/windows/doors/lights/tire condition
- tire states and handling penalties
- vehicle damage events/log
- driver reaction state
- traffic reaction foundation
- vehicle condition panel
- tire damage test

ONLINE SYNC:
- authoritative-server architecture
- WebSocket-ready event model
- sequence numbers
- session/player IDs
- 20 Hz sync target
- interest management for nearby entities
- player/vehicle/mission/NPC event replication structures
- server-authoritative economy, inventory, mission rewards and properties
- reconnect/session foundation

IMPORTANT:
This browser build contains the client/data architecture for synchronization, but production online multiplayer still requires an actual authoritative backend server. The design intentionally avoids pretending local browser code is real multiplayer.

Phases completed in the prototype:
1, 2, 3, 4, 5
Story and 34-mission campaign from earlier builds remain included.
