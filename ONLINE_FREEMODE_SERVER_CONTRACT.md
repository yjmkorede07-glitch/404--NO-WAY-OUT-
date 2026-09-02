# Online Freemode Server Contract

The Online world is not a mission browser. Players can walk/drive through Veyron and initiate activities directly from the world.

## Server messages
- `freemode_activity_start`
- `freemode_activity_started`
- `freemode_activity_progress`
- `freemode_activity_update`
- `freemode_activity_resolve`
- `freemode_activity_resolved`
- `freemode_activity_event`

## Bank robbery flow
1. Client detects an interactable bank.
2. Client requests `freemode_activity_start` with activity type and world position.
3. Server validates authentication, activity type and start distance.
4. Server creates an activity instance and assigns its authoritative heat/reward.
5. Client advances the activity by requests; server validates sequence and caps progress.
6. Once the server marks the activity `escape`, the player must escape the response area.
7. Client requests resolve with success/failure.
8. Server awards cash through the persistent profile transaction and sets wanted state.

## Important
This is an original Veyron implementation inspired by the structural idea of GTA V/GTA Online freemode + heists. No Rockstar code, content, names, maps, assets or dialogue are used.
