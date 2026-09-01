# ONLINE MISSION IMPLEMENTATION CONTRACT — Build 013

## Canonical catalogs
- Story: M01–M88 from `Content/Data/Missions/` and `campaign_88_missions.json`.
- Online: O01–O24 from `Content/Data/OnlineMissions/online_missions_24.json`.

## Runtime state
Every online mission instance has:
- missionInstanceId
- missionId
- serverSessionId
- partyId
- party member IDs
- current objective index/state
- start timestamp
- deadline/timeout
- mission seed
- world/district
- wanted state
- failure state
- reward transaction ID

## Request/response model
Client sends intent only. Server validates every intent and returns an authoritative event/state update.

Required request types:
`online_mission_list`, `online_party_create`, `online_party_join`, `online_party_ready`, `online_mission_start_request`, `online_objective_action`, `online_extract_request`, `online_mission_abandon`, `online_reconnect`.

Required server events:
`online_mission_offer`, `online_party_state`, `online_mission_reserved`, `online_mission_started`, `online_objective_update`, `online_wanted_update`, `online_mission_failed`, `online_mission_completed`, `online_reward_committed`, `online_mission_reconciled`.

## Reward transaction
The server creates one idempotent reward transaction before writing currency/XP/inventory. Repeated completion packets must not duplicate rewards.

## Story isolation
No online completion may modify E1–E4 ending flags, story mission completion, story relationship outcomes, or story save slots.

## Disconnect handling
A disconnected member becomes a temporary ghost/AI-disabled slot. The party remains valid for a short grace period. On reconnect, authoritative state is replayed. If the mission cannot safely resume, the server returns the player to the online hub and reconciles only committed rewards.

## Security minimum
Validate authenticated session, party membership, mission state, objective sequence, actor proximity, cooldowns, timestamps and reward eligibility on the server. Rate-limit high-frequency intent messages.
