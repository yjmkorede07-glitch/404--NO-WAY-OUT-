#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "NoWayOutMissionTypes.h"
#include "MissionDataAsset.generated.h"

UCLASS(BlueprintType)
class NOWAYOUT_API UNOWAYOUTMISSIONDATAASSET : public UPrimaryDataAsset
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FName MissionId;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FText Title;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FText Brief;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FText WinCondition;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FName Protagonist;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FName Location;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") TArray<FName> Prerequisites;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") TArray<FName> SupportingNPCs;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") TArray<FNWOMissionStep> PrototypeSteps;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") TArray<FNWOMissionObjective> OptionalObjectives;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FNWOMissionScoreConfig Score;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FNWOMissionReward Rewards;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") TMap<FName, int32> Consequences;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") TArray<FString> FailureConditions;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") TArray<FString> SuccessConditions;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") TArray<FName> UnlockedContent;
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="404|Source") FString SourceRevision;
};
