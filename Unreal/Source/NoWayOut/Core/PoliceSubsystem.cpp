#include "PoliceSubsystem.h"

void UNOWAYOUTPOLICESUBSYSTEM::RefreshState()
{
    switch (WantedLevel)
    {
    case 0: State = ENWOPoliceState::Clear; break;
    case 1: State = ENWOPoliceState::Suspicious; break;
    case 2: State = ENWOPoliceState::Searching; break;
    case 3: State = ENWOPoliceState::Pursuit; break;
    case 4: State = ENWOPoliceState::HeavyResponse; break;
    default: State = ENWOPoliceState::Manhunt; break;
    }
}

void UNOWAYOUTPOLICESUBSYSTEM::ReportIncident(FName District, int32 Severity, bool bWitness, bool bEvidence)
{
    int32 Delta = FMath::Clamp(Severity, 0, 5);
    if (bWitness) ++Delta;
    if (bEvidence) ++Delta;
    SetWantedLevel(WantedLevel + FMath::Clamp(Delta / 2, 1, 3));
}

void UNOWAYOUTPOLICESUBSYSTEM::SetWantedLevel(int32 Level)
{
    WantedLevel = FMath::Clamp(Level, 0, 5);
    RefreshState();
}

void UNOWAYOUTPOLICESUBSYSTEM::ReduceWanted(int32 Amount)
{
    SetWantedLevel(WantedLevel - FMath::Max(0, Amount));
}
