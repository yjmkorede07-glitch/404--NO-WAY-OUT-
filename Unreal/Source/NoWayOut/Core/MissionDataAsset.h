#pragma once
#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "NoWayOutMissionTypes.h"
#include "MissionDataAsset.generated.h"

UCLASS(BlueprintType)
class UNOWAYOUTMISSIONDATAASSET : public UPrimaryDataAsset {
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FName MissionId;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FText Title;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FName Protagonist;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FName Location;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") TArray<FName> Prerequisites;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") TArray<FNWOMissionObjective> Objectives;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FNWOMissionScoreConfig Score;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") TArray<FNWOMissionRelationshipEffect> RelationshipEffects;
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Mission") FGameplayTagContainer ConsequenceTags;
};
