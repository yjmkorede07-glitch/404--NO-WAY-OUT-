import json, pathlib, sys
root=pathlib.Path(__file__).resolve().parents[1]
checks=[]
def ok(name, cond): checks.append((name,bool(cond)))
d=json.loads((root/'freemode/freemode_activities.json').read_text())
ok('freemode registry', len(d['banks']) >= 9 and 'stock_trading' in [x['id'] for x in d['activity_families']])
for rel, keys in [('economy/economy_v2.json',['businesses','stock_market','dark_web']),('properties/property_registry.json',['property_types','upgrade_categories']),('construction/construction_system.json',['company','modes','real_time_world_progress']),('world/world_scale_and_weather_v2.json',['mountain_system','ski_resort','weather'])]:
    x=json.loads((root/rel).read_text()); ok(rel,all(k in x for k in keys))
source=root/'Unreal/Source/NoWayOut/Core'
for h in ['PropertyEconomyTypes.h','PropertySubsystem.h','MarketSubsystem.h','ConstructionSubsystem.h','WeatherSubsystem.h']:
    ok('C++ '+h,(source/h).exists())
    if (source/h).exists(): ok(h+' generated header', '#include "'+h.replace('.h','.generated.h')+'"' in (source/h).read_text())
for cpp in ['PropertySubsystem.cpp','MarketSubsystem.cpp','ConstructionSubsystem.cpp','WeatherSubsystem.cpp']:
    ok(cpp,(source/cpp).exists() and len((source/cpp).read_text())>100)
for n,c in checks: print(('PASS' if c else 'FAIL')+': '+n)
if not all(c for _,c in checks): sys.exit(1)
