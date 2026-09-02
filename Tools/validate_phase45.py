import json, pathlib, re, sys
root = pathlib.Path(__file__).resolve().parents[1]
errs=[]
for p in root.rglob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as e: errs.append(f'{p}: {e}')
required=[
 'Portable/Schemas/asset_manifest_v1.json',
 'Portable/Data/engine_compatibility_v1.json',
 'Portable/Data/world_data_contract_v1.json',
 'Portable/Data/mission_data_contract_v1.json',
 'Portable/Adapters/ADAPTER_CONTRACT.md'
]
for x in required:
    if not (root/x).exists(): errs.append('missing '+x)
classes={}
for p in (root/'Assets').rglob('*.cs'):
    t=p.read_text(errors='ignore')
    for c in re.findall(r'\bclass\s+(\w+)',t): classes.setdefault(c,[]).append(str(p))
for c,ps in classes.items():
    if len(ps)>1: errs.append('duplicate class '+c+': '+', '.join(ps))
print('JSON_ERRORS', sum(':' in e and not e.startswith('missing') for e in errs))
print('ERRORS', len(errs))
for e in errs: print(e)
sys.exit(1 if errs else 0)
