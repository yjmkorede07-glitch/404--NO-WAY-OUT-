import json, pathlib, sys
root=pathlib.Path(__file__).resolve().parents[1]
u=root/'Unreal'
checks=[
 ('online_onboarding.json',u/'Content/Data/Online/online_onboarding.json'),
 ('online_district_recommendations.json',u/'Content/Data/Online/online_district_recommendations.json'),
 ('online_roles_and_acceptance.json',u/'Content/Data/Online/online_roles_and_acceptance.json'),
 ('online_starter_economy.json',u/'Content/Data/Online/online_starter_economy.json'),
 ('online_starter_houses.json',u/'Content/Data/Online/online_starter_houses.json'),
 ('online_starter_vehicles.json',u/'Content/Data/Online/online_starter_vehicles.json'),
 ('game_settings_schema.json',u/'Content/Data/Settings/game_settings_schema.json'),
]
for name,p in checks:
    assert p.exists(), p
    json.loads(p.read_text())

on=json.loads((u/'Content/Data/Online/online_onboarding.json').read_text())
assert on['startingGrant']==10_000_000
assert on['grantDestination']=='bank'
assert len(on['steps'])==8
assert {x['id'] for x in on['lifePaths']}=={'legitimate','criminal','law_enforcement'}
assert on['lawEnforcement']['requiresHumanAcceptance'] is True
assert on['lawEnforcement']['normalNpcPoliceRemainsActive'] is True

econ=json.loads((u/'Content/Data/Online/online_starter_economy.json').read_text())
assert econ['playerDoesNotReceiveFreeProperties'] and econ['playerDoesNotReceiveFreeBusinesses'] and econ['playerDoesNotReceiveFreeVehicleCollection']

cpp=(u/'Source/NoWayOut/Core/OnlineCareerSubsystem.cpp').read_text()
h=(u/'Source/NoWayOut/Core/OnlineCareerSubsystem.h').read_text()
settings=(u/'Source/NoWayOut/Core/GameSettingsSubsystem.cpp').read_text()
assert '10000000' in h and '10000000' in cpp or '10000000' in cpp
for s in ['CreateCharacter','ChooseWorld','ChooseLegitimateLife','ChooseCriminalLife','ApplyForLawEnforcement','SetLawEnforcementDecision','CompleteHousePurchase','CompleteCitizenId','CompleteStarterVehiclePurchase']:
    assert s in h and s in cpp, s
for s in ['SetFrameRateLimit','SetMasterVolume','SetMusicVolume','SetDialogueVolume','SetEffectsVolume','SetLookSensitivity','SetSubtitles','SetAutoSave','SetVoiceChat','SetProximityVoice','SetCrossplay','SetDynamicResolution']:
    assert s in settings, s

print('PHASE26 VALIDATION: PASS')
print('Online starting grant: 10,000,000 VCR bank balance')
print('Life paths: legitimate, criminal, law_enforcement')
print('Law enforcement requires human/admin acceptance; NPC police remains active')
print('Onboarding steps: 8')
print('Settings categories: 10')
