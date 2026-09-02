import json, pathlib, zipfile
root=pathlib.Path(__file__).resolve().parents[0]
checks=[
 'Server/law_enforcement_career_contract.json',
 'Godot/data/law_enforcement_career_v1.json',
 'Godot/scripts/law_enforcement_manager.gd',
 'Unreal/Source/NoWayOut/Online/LawEnforcementCareerTypes.h',
 'Unreal/Source/NoWayOut/Online/LawEnforcementSubsystem.h',
 'Unreal/Source/NoWayOut/Online/LawEnforcementSubsystem.cpp',
 'Unreal/Content/Data/Online/mobile_storage_budget_v1.json',
 'Docs/PHASE33_LAW_ENFORCEMENT_AND_SHIPPING_BUDGET.md'
]
for f in checks:
    assert (root/f).exists(), f
for f in root.rglob('*.json'):
    json.loads(f.read_text())
print('PHASE33 PASS')
