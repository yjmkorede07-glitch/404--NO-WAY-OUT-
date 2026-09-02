import json, pathlib, zipfile
root=pathlib.Path(__file__).resolve().parent
required=[
"Server/core_gameplay_authority_v1.json",
"Godot/data/interactions/core_gameplay_interaction_v1.json",
"Godot/data/interactions/interaction_registry_v1.json",
"Godot/scripts/interaction_manager.gd",
"Godot/scripts/mission_cinematic_flow.gd",
"Unreal/Source/NoWayOut/Interaction/CoreGameplayInteractionSubsystem.h",
"Unreal/Source/NoWayOut/Interaction/CoreGameplayInteractionSubsystem.cpp",
"Docs/PHASE34_CORE_GAMEPLAY_INTERACTION.md"]
for f in required: assert (root/f).exists(), f
for f in root.rglob("*.json"): json.loads(f.read_text())
r=json.loads((root/"Godot/data/interactions/interaction_registry_v1.json").read_text())
assert len(r["interactions"]) >= 18
ids={x["id"] for x in r["interactions"]}
for x in ["plate_check","arrest","request_ambulance","robbery","purchase"]: assert x in ids
print("PHASE34 PASS")
