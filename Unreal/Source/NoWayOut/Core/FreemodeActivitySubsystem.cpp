#include "FreemodeActivitySubsystem.h"

bool UFreemodeActivitySubsystem::StartActivity(FName ActivityId, const FName LocationId)
{
    const FFreemodeActivityDefinition* Definition = Definitions.FindByPredicate([&](const FFreemodeActivityDefinition& D){ return D.ActivityId == ActivityId && D.LocationId == LocationId; });
    if (!Definition) return false;
    FFreemodeActivityInstance Instance;
    Instance.InstanceId = FGuid::NewGuid();
    Instance.ActivityId = ActivityId;
    Instance.State = EFreemodeActivityState::Approach;
    Instance.ServerRevision = 1;
    Instance.CurrentReward = Definition->BaseReward;
    Instance.Heat = Definition->HeatGain;
    ActiveActivities.Add(Instance);
    return true;
}

bool UFreemodeActivitySubsystem::AdvanceActivity(FName ActivityId, EFreemodeActivityState RequestedState)
{
    FFreemodeActivityInstance* Instance = ActiveActivities.FindByPredicate([&](FFreemodeActivityInstance& I){ return I.ActivityId == ActivityId && I.State != EFreemodeActivityState::Resolved; });
    if (!Instance) return false;
    Instance->State = RequestedState;
    ++Instance->ServerRevision;
    return true;
}

bool UFreemodeActivitySubsystem::ResolveActivity(FName ActivityId, bool bSuccess)
{
    FFreemodeActivityInstance* Instance = ActiveActivities.FindByPredicate([&](FFreemodeActivityInstance& I){ return I.ActivityId == ActivityId && I.State != EFreemodeActivityState::Resolved; });
    if (!Instance) return false;
    Instance->State = EFreemodeActivityState::Resolved;
    ++Instance->ServerRevision;
    if (!bSuccess) Instance->CurrentReward = 0;
    return true;
}

void UFreemodeActivitySubsystem::LoadDefinitionsFromJson(const FString& JsonText)
{
    // Phase 23 contract: editor/runtime importer will convert freemode_activities.json into these data records.
    // Kept intentionally dependency-light until the authoritative data importer is wired.
    Definitions.Reset();
}
