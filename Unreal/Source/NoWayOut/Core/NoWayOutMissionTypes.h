#pragma once

#include "CoreMinimal.h"
#include "GameplayTagContainer.h"
#include "NoWayOutMissionTypes.generated.h"

UENUM(BlueprintType)
enum class ENWOMissionState : uint8
{
    Locked,
    Available,
    Discovered,
    Active,
    Completed,
    Failed
};

UENUM(BlueprintType)
enum class ENWOProtagonist : uint8
{
    Darius,
    Malik,
    Amara,
    NPC,
    All
};

USTRUCT(BlueprintType)
struct FNWOMissionObjective
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly) FName ObjectiveId;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FText Text;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) bool bOptional = false;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Points = 0;
};

USTRUCT(BlueprintType)
struct FNWOMissionStep
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly) FName StepId;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FName Kind;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FName Target;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FText Text;
};

USTRUCT(BlueprintType)
struct FNWOMissionRelationshipEffect
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly) FName CharacterA;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FName CharacterB;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 TrustDelta = 0;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 AffectionDelta = 0;
};

USTRUCT(BlueprintType)
struct FNWOMissionScoreConfig
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Critical = 50;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Optional = 20;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Time = 10;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Survival = 10;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Precision = 10;
};

USTRUCT(BlueprintType)
struct FNWOMissionReward
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Cash = 0;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Reputation = 0;
};

USTRUCT(BlueprintType)
struct FNWOEndingState
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly) FName EndingId;
    UPROPERTY(BlueprintReadOnly) bool bLocked = false;
};
