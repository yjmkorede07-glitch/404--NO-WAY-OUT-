import json, pathlib, re, zipfile, sys
root = pathlib.Path(__file__).resolve().parents[1]
errors=[]
for p in root.rglob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as e: errors.append(f'JSON {p}: {e}')
classes={}
for p in root.rglob('*.cs'):
    t=p.read_text(encoding='utf-8', errors='ignore')
    for c in re.findall(r'\bclass\s+(\w+)',t): classes.setdefault(c,[]).append(str(p))
for c,ps in classes.items():
    if len(ps)>1: errors.append(f'Duplicate class {c}: {ps}')
for req in ['Assets/404NoWayOut/Runtime/Online/OnlinePlayerSystem.cs','Assets/404NoWayOut/Data/Online/online_player_system_v1.json']:
    if not (root/req).exists(): errors.append(f'Missing {req}')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print('JSON errors: 0')
print('Duplicate classes: 0')
print('Required Phase 44 files: present')
print('Phase 44 validation: PASS')
