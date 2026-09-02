import json, pathlib, re, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
errors=[]
up=ROOT/'NoWayOut.uproject'
try: data=json.loads(up.read_text())
except Exception as e: errors.append(f'uproject JSON: {e}')
else:
    names={m['Name'] for m in data.get('Modules',[])}
    for required in ('NoWayOut','NoWayOutEditor'):
        if required not in names: errors.append(f'missing module {required}')
manifest=ROOT/'Content/Data/campaign_88_missions.json'
try: camp=json.loads(manifest.read_text())
except Exception as e: errors.append(f'campaign JSON: {e}'); camp={}
missions=camp.get('missions',[])
if len(missions)!=88: errors.append(f'campaign mission count {len(missions)} != 88')
ids=[m.get('id') for m in missions]
if ids != [f'M{i:02d}' for i in range(1,89)]: errors.append('mission IDs are not M01-M88 sequential')
source_files=sorted((ROOT/'Content/Data/Missions').glob('M*.json'))
if len(source_files)!=88: errors.append(f'mission source files {len(source_files)} != 88')
for m in missions:
    p=ROOT/'Content/Data/Missions'/f"{m['id']}.json"
    if not p.exists(): errors.append(f'missing source {p.name}')
    else:
        try:
            one=json.loads(p.read_text())
            if one.get('id')!=m.get('id') or one.get('title')!=m.get('title'): errors.append(f'{p.name} differs from authoritative manifest')
        except Exception as e: errors.append(f'{p.name}: {e}')
# Required source contracts.
for rel in ['Source/NoWayOut/NoWayOut.Build.cs','Source/NoWayOut/NoWayOut.cpp','Source/NoWayOut/Core/MissionDataAsset.h','Source/NoWayOut/Core/MissionSubsystem.cpp','Source/NoWayOut/Core/RelationshipSubsystem.cpp','Source/NoWayOut/Core/WorldSimSubsystem.cpp','Source/NoWayOut/Core/PoliceSubsystem.cpp','Source/NoWayOut/Core/EconomySubsystem.cpp','Source/NoWayOut/Core/SaveSubsystem.cpp','Source/NoWayOutEditor/MissionAssetImportSubsystem.cpp']:
    if not (ROOT/rel).exists(): errors.append(f'missing source contract {rel}')
for f in ROOT.rglob('*.h'):
    s=f.read_text(errors='ignore')
    if 'GENERATED_BODY()' in s and '.generated.h' not in s: errors.append(f'generated header include missing: {f}')
print(f'Phase 20 static validation: {"PASS" if not errors else "FAIL"}')
print(f'Missions: {len(missions)} | Per-mission source JSON: {len(source_files)}')
if errors:
    for e in errors: print('ERROR:',e)
    sys.exit(1)
