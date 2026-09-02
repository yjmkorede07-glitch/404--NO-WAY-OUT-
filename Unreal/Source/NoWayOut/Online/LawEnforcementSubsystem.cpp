#include "LawEnforcementSubsystem.h"

bool ULawEnforcementSubsystem::CanUseAction(const FString& Action) const {
    if (!bAccepted) return false;
    if (Action == TEXT("plate_check") || Action == TEXT("vehicle_stop") || Action == TEXT("detain") || Action == TEXT("arrest") || Action == TEXT("citation") || Action == TEXT("request_fire") || Action == TEXT("request_tow") || Action == TEXT("scene_perimeter"))
        return Rank != ELawEnforcementRank::Cadet;
    return Action == TEXT("id_check") || Action == TEXT("dispatch_backup") || Action == TEXT("request_ambulance") || Action == TEXT("incident_report");
}

void ULawEnforcementSubsystem::SetAccepted(bool bInAccepted, ELawEnforcementRank InRank) { bAccepted = bInAccepted; Rank = InRank; }

bool ULawEnforcementSubsystem::RequestEmergencyService(const FString& Service, const FString& IncidentId) {
    return bAccepted && (Service == TEXT("police") || Service == TEXT("ambulance") || Service == TEXT("fire") || Service == TEXT("tow")) && !IncidentId.IsEmpty();
}
