# 404: NO WAY OUT — Freemode Criminal Sandbox

## Locked design decision
The game is **not** "88 missions + 24 online missions". Those missions are the authored campaign layer. Both Story and Online also contain a persistent freemode simulation where players can create their own trouble.

This follows the useful structural lesson from GTA V/GTA Online: authored missions coexist with a world that can generate activities, businesses, police reactions, opportunities and repeatable jobs. Rockstar's official material describes GTA Online as a dynamic world and its freemode events as voluntary activities; its heists also use setup/finale structures rather than making every criminal action a single linear mission. We are using that structure as inspiration, not copying Rockstar content or assets. 

## Three gameplay layers
1. **Story Campaign** — 88 canonical missions, 4 endings, protagonist-specific writing.
2. **Story Freemode** — unscripted robberies, thefts, encounters, police pursuits, side opportunities and world-state consequences.
3. **Online Freemode** — persistent player economy, businesses, player-created crews, repeatable crimes, events and 24 authored online missions.

## What the player can do without selecting a mission
Examples:
- Walk into Veyron Bank and attempt a robbery.
- Rob a convenience store.
- Intercept an armored cash vehicle.
- Steal a parked or occupied vehicle.
- Discover a moving cash pickup.
- Start a street territory event.
- Respond to a police transport or criminal opportunity.
- Abort the activity and simply continue driving around Veyron.

These activities are **world interactions**, not automatically mission instances.

## Bank robbery example
The player approaches Veyron Bank in free roam. A contextual interaction becomes available only when the bank is open and the player has a valid criminal state. The player can begin the robbery. The game creates a temporary robbery activity with:
- security state
- civilian/witness state
- cash available
- alarm state
- police escalation
- escape requirement
- payout calculation
- cooldown

If the player succeeds, the cash is awarded and the world remembers that branch's consequences. If the player fails, they can be arrested, escape empty-handed, or abandon the robbery. The event does not require an authored mission marker.

## Mission crossover
Freemode consequences can feed authored content. Example: if the player robbed Veyron Bank earlier, M37 can detect the bank's altered security state, an NPC can mention the robbery, or a later mission can offer a different route. This is optional and data-driven; the 88-mission canon remains stable.

## Online anti-cheat rule
The client may request `StartRobbery`, `InteractWithVault`, `EscapeRobbery`, and `ClaimReward`. The server validates:
- player position and interaction radius
- bank state
- cooldown
- inventory/equipment requirements
- robbery state transition
- police/heat changes
- reward amount
- session membership

The client never owns the final cash payout.

## Inspiration boundary
Reference: GTA V/GTA Online's combination of story missions, freemode, heists, businesses and optional events. Do not copy Rockstar names, scripts, maps, characters, UI, dialogue, art, audio or proprietary implementation. Build an original Veyron system around our own fiction and data.
