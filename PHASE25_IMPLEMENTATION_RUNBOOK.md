# PHASE 25 IMPLEMENTATION RUNBOOK

## Locked additions
- Story and Online both retain physical banks/stores and freemode activities.
- Online character creation includes world/shard selection.
- Citizen ID is a physical-world progression step at Civic Center/Registry locations.
- Player-to-player money transfers are supported Online through phone/ATM/bank terminal and are server authoritative.
- Story uses the same system families where appropriate, but keeps its own single-player ledger.
- New regions are connected to selected existing story missions rather than creating a disconnected map expansion.

## Next Unreal implementation order
1. Build the physical Civic Center/Registry POIs.
2. Build the Online Character Creation UMG flow.
3. Bind `UOnlineIdentitySubsystem` to the creation and ID activation screens.
4. Bind `UOnlineMoneySubsystem` to phone/ATM/bank transfer UI.
5. Implement authoritative backend transfer transaction.
6. Add world/shard selection to online login/session creation.
7. Connect world integration hooks to M06, M19, M26, M35, M37, M38, M39, M40, M49, M50, M69, M83 and M88.
8. Replace greybox region markers with final World Partition level data when art exists.
