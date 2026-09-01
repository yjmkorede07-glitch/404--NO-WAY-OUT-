# 404: NO WAY OUT — Real Multiplayer Server

## Requirements
- Node.js 18+
- npm

## Start locally
1. `cd server`
2. `npm install`
3. `npm start`

The server listens on port 8080 by default.

## Architecture
- WebSocket transport
- Server-authoritative movement validation
- Server-authoritative wanted level/crime events
- Server-authoritative mission events
- Server-authoritative vehicle state
- Player/session IDs
- 16-player session limit in this prototype
- Server heartbeat/world tick

## Production work still required
- Persistent database
- Authentication/account service
- TLS/WSS
- Matchmaking/lobbies
- Redis or equivalent for multi-instance sessions
- authoritative NPC simulation at scale
- persistent economy/inventory/property storage
- anti-cheat hardening
- rate limits and abuse controls
- telemetry/moderation
- deployment/load balancing

This is a real runnable multiplayer backend foundation, not a fake local "online" screen. It is intentionally small enough to evolve with Phases 7–10.
