#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "PropertyEconomyTypes.h"
#include "ConstructionSubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UConstructionSubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable, Category="404|Construction") bool StartProject(FName ProjectId, FName PropertyOrPlotId, int64 ContractValue);
    UFUNCTION(BlueprintCallable, Category="404|Construction") void AdvanceProject(FName ProjectId, float ProgressDelta);
    UFUNCTION(BlueprintPure, Category="404|Construction") FConstructionProject GetProject(FName ProjectId) const;
    UFUNCTION(BlueprintPure, Category="404|Construction") TArray<FConstructionProject> GetProjects() const { return Projects; }
private:
    UPROPERTY() TArray<FConstructionProject> Projects;
};
