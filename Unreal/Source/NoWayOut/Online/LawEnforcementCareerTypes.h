#pragma once
#include "CoreMinimal.h"
#include "LawEnforcementCareerTypes.generated.h"

UENUM(BlueprintType)
enum class ELawEnforcementRank : uint8 { Cadet, Officer, SeniorOfficer };

USTRUCT(BlueprintType)
struct FLawEnforcementActionRequest {
    GENERATED_BODY()
    UPROPERTY(BlueprintReadWrite) FString Action;
    UPROPERTY(BlueprintReadWrite) FString TargetId;
    UPROPERTY(BlueprintReadWrite) FString IncidentId;
};
