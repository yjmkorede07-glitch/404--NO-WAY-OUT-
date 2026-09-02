import json, pathlib
root=pathlib.Path(__file__).resolve().parents[1]
checks=[]
for f in root.rglob('*.json'):
    try: json.loads(f.read_text()); checks.append((str(f.relative_to(root)), 'OK'))
    except Exception as e: checks.append((str(f.relative_to(root)), 'ERROR:'+str(e)))
cs=list(root.rglob('*.cs'))
brace=[]
for f in cs:
    s=f.read_text(); brace.append((str(f.relative_to(root)), s.count('{')==s.count('}')))
print('JSON errors:',sum(x[1].startswith('ERROR') for x in checks))
print('C# brace errors:',sum(not x[1] for x in brace))
