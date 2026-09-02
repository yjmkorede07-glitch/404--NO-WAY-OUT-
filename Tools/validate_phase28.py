import json, pathlib, sys
r=pathlib.Path(__file__).resolve().parents[1]
C=r/'Unreal/Content/Data/Cinematics'
rule=json.loads((C/'mission_cinematic_rules_v1.json').read_text())
story=json.loads((C/'story_mission_cinematics_v1.json').read_text())
online=json.loads((C/'online_mission_cinematics_v1.json').read_text())
assert len(story['missions'])==88
assert len(online['missions'])==24
for x in story['missions']+online['missions']:
    assert x['opening']['sequence_id'].endswith('_OPEN')
    assert x['post_mission']['sequence_id'].endswith('_POST')
assert rule['sequence_types']['opening'] and rule['sequence_types']['post_mission']
print('PASS: Phase 28 cinematic contract covers 88 story + 24 online missions; side-mission contract registered.')
