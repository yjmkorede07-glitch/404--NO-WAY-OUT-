import json, pathlib, re, sys
root=pathlib.Path(__file__).resolve().parents[1]
errors=[]
for p in root.rglob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as e: errors.append(f'{p}: {e}')
classes={}
for p in root.rglob('*.cs'):
    text=p.read_text(encoding='utf-8')
    if text.count('{') != text.count('}'): errors.append(f'{p}: brace mismatch')
    for name in re.findall(r'\bclass\s+(\w+)',text): classes.setdefault(name,[]).append(str(p))
for n,ps in classes.items():
    if len(ps)>1: errors.append(f'duplicate class {n}: {ps}')
required=['Assets/404NoWayOut/Runtime/Missions/MissionRuntimeManager.cs','Assets/404NoWayOut/Runtime/Combat/CombatRuntime.cs','Assets/404NoWayOut/Runtime/Police/PolicePursuitRuntime.cs','Assets/404NoWayOut/Runtime/Commerce/PhysicalCommerceRuntime.cs','Assets/404NoWayOut/Runtime/Combat/VehicleTireTarget.cs']
for r in required:
    if not (root/r).exists(): errors.append(f'missing {r}')
if errors: print('\n'.join(errors)); sys.exit(1)
print('Phase 40 validation PASS')
print('JSON: valid')
print('C#: structural braces valid')
print('Required runtime files: present')
