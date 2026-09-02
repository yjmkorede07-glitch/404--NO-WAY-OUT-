import json, pathlib, re, zipfile
root=pathlib.Path(__file__).resolve().parents[1]
errors=[]
for p in root.rglob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as e: errors.append(f'JSON {p}: {e}')
classes={}
for p in root.rglob('*.cs'):
    s=p.read_text(encoding='utf-8', errors='replace')
    if s.count('{')!=s.count('}'): errors.append(f'BRACES {p}')
    for c in re.findall(r'\bclass\s+(\w+)',s):
        classes.setdefault(c,[]).append(str(p))
for c,ps in classes.items():
    if len(ps)>1: errors.append(f'DUPLICATE CLASS {c}: {ps}')
required=[
'Assets/404NoWayOut/Runtime/Online/OnlineWorldRuntime.cs',
'Assets/404NoWayOut/Runtime/Online/OnlinePersistenceContract.cs',
'Assets/404NoWayOut/Runtime/Online/ForceAdminService.cs',
'Assets/404NoWayOut/Data/Online/online_world_contract_v1.json',
'Assets/404NoWayOut/Data/Online/force_admin_v2.json',
'Assets/404NoWayOut/Data/Online/online_activity_jobs_v1.json']
for r in required:
    if not (root/r).exists(): errors.append('MISSING '+r)
print('JSON_ERRORS', sum(1 for e in errors if e.startswith('JSON ')))
print('STRUCTURAL_ERRORS', len(errors)-sum(1 for e in errors if e.startswith('JSON ')))
for e in errors: print(e)
if errors: raise SystemExit(1)
