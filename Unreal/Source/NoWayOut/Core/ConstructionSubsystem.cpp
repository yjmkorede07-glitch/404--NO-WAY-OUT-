#include "ConstructionSubsystem.h"
#include "EconomySubsystem.h"
#include "Engine/GameInstance.h"

bool UConstructionSubsystem::StartProject(FName ProjectId, FName PropertyOrPlotId, int64 ContractValue)
{
    if (ProjectId.IsNone() || PropertyOrPlotId.IsNone() || ContractValue <= 0 || GetProject(ProjectId).ProjectId == ProjectId) return false;
    if (UGameInstance* GI = GetGameInstance()) if (UNOWAYOUTECONOMYSUBSYSTEM* E = GI->GetSubsystem<UNOWAYOUTECONOMYSUBSYSTEM>()) if (!E->SpendCash(ContractValue / 4)) return false;
    FConstructionProject P; P.ProjectId = ProjectId; P.PropertyOrPlotId = PropertyOrPlotId; P.ConstructionState = TEXT("survey"); P.ContractValue = ContractValue; Projects.Add(P); return true;
}
void UConstructionSubsystem::AdvanceProject(FName ProjectId, float ProgressDelta)
{
    for (FConstructionProject& P : Projects) if (P.ProjectId == ProjectId && !P.bComplete) { P.Progress = FMath::Clamp(P.Progress + ProgressDelta, 0.0f, 100.0f); if (P.Progress >= 100.0f) { P.bComplete = true; P.ConstructionState = TEXT("finished"); } else if (P.Progress < 15) P.ConstructionState = TEXT("survey"); else if (P.Progress < 35) P.ConstructionState = TEXT("foundation"); else if (P.Progress < 55) P.ConstructionState = TEXT("frame"); else if (P.Progress < 75) P.ConstructionState = TEXT("exterior"); else if (P.Progress < 92) P.ConstructionState = TEXT("interior"); else P.ConstructionState = TEXT("landscaping"); }
}
FConstructionProject UConstructionSubsystem::GetProject(FName ProjectId) const { for (const FConstructionProject& P : Projects) if (P.ProjectId == ProjectId) return P; return FConstructionProject(); }
