import json, pathlib, re, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
checks=[]
def load(rel):
    p=ROOT/rel
    checks.append((rel,p.exists()))
    if not p.exists(): raise SystemExit(f"missing {rel}")
    return json.loads(p.read_text())

time=load('world/time_and_lifestyle_v1.json')
assert time['real_time_scale']['real_minutes_per_ingame_hour']==5
assert time['real_time_scale']['real_minutes_per_ingame_day']==120
ls=time['online_lifestyle_change']; assert ls['cooldown_real_minutes']==120
assert ls['criminal_to_legitimate'] and ls['legitimate_to_criminal']
cin=load('online/online_opening_cinematics_v1.json'); assert len(cin['sequence'])==2
biz=load('business/legitimate_fronts_with_illegal_sides_v1.json'); assert len(biz['businesses'])>=10
assert all('legal' in b and b['illegal_sides'] for b in biz['businesses'])
for rel in ['Unreal/Source/NoWayOut/Core/OnlineLifestyleSubsystem.cpp','Unreal/Source/NoWayOut/Core/OnlineTimeSubsystem.h','Unreal/Source/NoWayOut/Core/OnlineOpeningCinematicSubsystem.h','js/online_lifestyle.js','server/db.js','server/server.js']:
    p=ROOT/rel; assert p.exists(),rel
server=(ROOT/'server/server.js').read_text(); db=(ROOT/'server/db.js').read_text()
for token in ['online_grant_claim','online_law_apply','online_law_admin_decide','business_illegal_activity']:
    assert token in server,token
for token in ['claimOnlineStartingGrant','submitLawEnforcementApplication','decideLawEnforcementApplication','business_illegal_activity']:
    assert token in db,token
print('PHASE27 PASS')
print('5 real minutes = 1 in-game hour; 120 real minutes = 1 in-game day')
print('Lifestyle cooldown = 120 real minutes')
print(f'Business dual-use entries = {len(biz["businesses"])}')
print('Server one-time grant + law admin acceptance + business side-activity persistence present')
