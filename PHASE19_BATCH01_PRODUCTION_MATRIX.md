# 404: NO WAY OUT — PHASE 19 BATCH 01 PRODUCTION MATRIX

## Scope
Batch 01 covers M01-M10. The goal is to implement the gameplay/state contracts now while keeping the browser build explicitly a 2D vertical slice. Unreal production consumes the same mission data contracts later.

## M01-M10 required production layers

| Mission | Gameplay implementation | World/NPC | Story/state | Presentation contract | QA gate |
|---|---|---|---|---|---|
| M01 | Airport → cab → family house → investigation | airport/cab/house hooks | first lead, evidence | arrival/cab/discovery beats | 4 objectives + reload + M02 unlock |
| M02 | Bank travel + account interaction | bank hook | financial trail/evidence | transaction reveal | locked before M01 + persistence |
| M03 | Malik handoff + 3-name investigation | Central/street contacts | names/evidence/relationship | handoff + reveal | 3 actions + M04 unlock |
| M04 | Amara handoff + call/meeting | Central meeting hook | call/exposure/relationship | phone + introduction | Amara active + persistence |
| M05 | Central → bank → market → police HQ → safehouse | traffic/crowd/world sim | route state | route montage/location cues | all route targets resolve |
| M06 | North Hills observation | target/awareness hook | evidence + clean/heat state | stealth tension | complete without wanted escalation |
| M07 | Workshop interaction | Reed Workshop + Malik | cooperation/trust | workshop dialogue | NPC hook + relationship update |
| M08 | Port → container → escape | port/police/world event hooks | evidence/pressure | container + escape beats | pressure persists and escape resolves |
| M09 | Police HQ + 3 social contacts | social contacts + police response | trust | dialogue/response cues | no automatic combat/response |
| M10 | Central + 3 information actions | Amara | evidence/relationship/batch gate | synthesis beat | 3 info actions + M11 availability |

## Every mission must carry

- playable protagonist assignment
- prerequisite state
- objective/checkpoint state
- mission result and score
- failure/retry behavior
- save persistence
- evidence/exposure/police effects where applicable
- relationship effects where applicable
- world/NPC hooks where applicable
- location/interior hooks
- cinematic beat contract
- audio/VO cue contract
- animation requirements
- art/world requirements
- Unreal migration data contract

## Production boundary

Implemented now means browser-prototype gameplay/state behavior and data contracts. It does **not** mean production 3D character art, animation, voice recording, full cinematics, final vehicle physics, full interiors, or production online infrastructure are finished. Those remain content/engineering production tasks for the Unreal build.
