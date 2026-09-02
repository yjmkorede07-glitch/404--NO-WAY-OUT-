#include "WorldSimulationSubsystem.h"

void UWorldSimulationSubsystem::AdvanceRealSeconds(float Seconds){
 Accumulator += FMath::Max(0.f,Seconds);
 constexpr float RealSecondsPerGameMinute = 5.f/60.f;
 while(Accumulator >= RealSecondsPerGameMinute){ Accumulator -= RealSecondsPerGameMinute; AdvanceOneGameMinute(); }
}
void UWorldSimulationSubsystem::AdvanceOneGameMinute(){
 ++Clock.Minute;
 if(Clock.Minute>=60){ Clock.Minute=0; ++Clock.Hour; }
 if(Clock.Hour>=24){ Clock.Hour=0; ++Clock.Day; }
}
void UWorldSimulationSubsystem::SetWeatherState(const FString& Weather){ WeatherId=Weather; }
void UWorldSimulationSubsystem::RegisterNPC(const FString& Id,const FString& Profile,const FString& District){ FNPCScheduleState S; S.ProfileId=Profile; S.District=District; NPCs.Add(Id,S); }
void UWorldSimulationSubsystem::UnregisterNPC(const FString& Id){ NPCs.Remove(Id); }
void UWorldSimulationSubsystem::RegisterDynamicEvent(const FString& Id,const FString& District,float Heat){ FDynamicWorldEvent E; E.EventId=Id; E.District=District; E.Heat=Heat; E.bActive=true; Events.Add(Id,E); }
void UWorldSimulationSubsystem::ResolveDynamicEvent(const FString& Id){ if(FDynamicWorldEvent* E=Events.Find(Id)){ E->bActive=false; } }
float UWorldSimulationSubsystem::GetTrafficDensity(const FString& District) const{
 float D=.62f; if(Clock.Hour>=7 && Clock.Hour<=9) D*=1.35f; if(Clock.Hour>=16 && Clock.Hour<=19) D*=1.4f;
 if(WeatherId=="rain") D*=.82f; else if(WeatherId=="heavy_rain") D*=.68f; else if(WeatherId=="fog") D*=.72f; else if(WeatherId=="snow") D*=.58f; else if(WeatherId=="blizzard") D*=.32f;
 return FMath::Clamp(D,.05f,1.5f);
}
