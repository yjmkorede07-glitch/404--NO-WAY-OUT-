#include "NPCPoliceSimulation.h"
void UNPCPoliceSimulation::ReportIncident(const FString& District,float Severity){ DistrictHeat.FindOrAdd(District)=FMath::Clamp(DistrictHeat.FindRef(District)+Severity,0.f,100.f); }
