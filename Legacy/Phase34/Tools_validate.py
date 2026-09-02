import json, pathlib, zipfile
root=pathlib.Path(__file__).parent
files=[root/'Unreal/Content/Data/World/dynamic_world_simulation_v1.json',root/'Godot/data/dynamic_world_simulation_v1.json',root/'Server/world_simulation_contract.json']
for f in files: json.loads(f.read_text())
required=['Unreal/Source/NoWayOut/World/WorldSimulationSubsystem.h','Unreal/Source/NoWayOut/World/WorldSimulationSubsystem.cpp','Unreal/Source/NoWayOut/AI/NPCScheduleSubsystem.cpp','Unreal/Source/NoWayOut/Police/NPCPoliceSimulation.cpp','Unreal/Source/NoWayOut/Economy/BusinessWorldStateSubsystem.cpp','Godot/scripts/world_clock.gd','Docs/PHASE31_DYNAMIC_WORLD_SIMULATION.md']
assert all((root/x).exists() for x in required)
print('PHASE31 PASS')
