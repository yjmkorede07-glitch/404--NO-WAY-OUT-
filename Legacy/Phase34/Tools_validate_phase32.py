import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
checks = [
    ROOT / 'Godot/data/world_agents_v1.json',
    ROOT / 'Server/world_agents_contract.json',
]
for p in checks:
    with p.open(encoding='utf-8') as f:
        json.load(f)

gd = (ROOT / 'Godot/scripts/world_agent_manager.gd').read_text(encoding='utf-8')
for token in ['should_spawn_agent', 'register_police_incident', 'set_business_state', 'start_dynamic_event']:
    assert token in gd, token

cfg = json.loads((ROOT / 'Godot/data/world_agents_v1.json').read_text(encoding='utf-8'))
assert cfg['police']['npc_police_always_active'] is True
assert cfg['spawn_rules']['never_despawn_active_pursuit'] is True
assert cfg['mission_hooks']['side_missions_use_same_world'] is True
assert cfg['dynamic_events']['max_concurrent_per_district'] == 3
print('PHASE32 PASS')
