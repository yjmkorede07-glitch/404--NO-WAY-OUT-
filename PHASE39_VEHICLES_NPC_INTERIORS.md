# PHASE 39 — VEHICLES, NPCs, POLICE, INTERIORS & FREEMODE

Phase 39 extends the Phase 38 playable foundation with reusable gameplay runtime components.

## Built
- Vehicle seat enter/exit runtime with a dedicated vehicle action rather than a universal E key.
- Vehicle tire states and handling penalties.
- NPC behavior state runtime for travel/work/flee/respond/arrest states.
- Police response director layered on the existing wanted-star runtime.
- Interior activity runtime for homes, businesses, banks, police facilities, hospitals, workshops and other interiors.
- Automatic door controller: ordinary authorized/unrestricted doors open as the player approaches without a button press.
- Freemode activity runtime for robberies, theft and other physical-world activities.
- Data registries for vehicle, NPC, interior and freemode gameplay.

## Locked controls
There is no universal E interaction. Actions remain on dedicated inputs. Door traversal is automatic where the door rules allow it.

## Accessibility
100% meaningful world remains locked. 84% fully accessible/interactable remains locked.

## Validation boundary
Static C# structural validation and JSON parsing are performed here. Unity Editor compile/play-mode testing remains required on the production PC.
