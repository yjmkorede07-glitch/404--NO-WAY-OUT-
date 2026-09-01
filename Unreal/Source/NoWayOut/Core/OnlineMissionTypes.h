#pragma once
#include "CoreMinimal.h"
#include "OnlineMissionTypes.generated.h"

USTRUCT(BlueprintType)
struct FOnlineMissionObjectiveState
{
    GENERATED_BODY()
    UPROPERTY(EditAnywhere, BlueprintReadWrite) FName ObjectiveId;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) int32 Index = 0;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) bool bCompleted = false;
};

USTRUCT(BlueprintType)
struct FOnlineMissionInstanceState
{
    GENERATED_BODY()
    UPROPERTY(EditAnywhere, BlueprintReadWrite) FName MissionId;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) FString MissionInstanceId;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) FString PartyId;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) int32 CurrentObjective = 0;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) bool bStarted = false;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) bool bCompleted = false;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) bool bFailed = false;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) int32 ServerRevision = 0;
};
