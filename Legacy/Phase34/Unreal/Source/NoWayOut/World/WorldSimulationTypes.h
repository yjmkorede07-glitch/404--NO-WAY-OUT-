#pragma once
#include "CoreMinimal.h"
#include "WorldSimulationTypes.generated.h"

UENUM(BlueprintType)
enum class EWorldActivityPhase : uint8 { Sleep, Commute, Work, Leisure, Home, Scouting, Meeting, OffBookJob, Errands, Study, JobSearch };

USTRUCT(BlueprintType)
struct FWorldClockState { GENERATED_BODY() UPROPERTY(BlueprintReadOnly) int32 Day=1; UPROPERTY(BlueprintReadOnly) int32 Hour=8; UPROPERTY(BlueprintReadOnly) int32 Minute=0; };

USTRUCT(BlueprintType)
struct FNPCScheduleState { GENERATED_BODY() UPROPERTY(BlueprintReadOnly) FString ProfileId; UPROPERTY(BlueprintReadOnly) EWorldActivityPhase Phase=EWorldActivityPhase::Home; UPROPERTY(BlueprintReadOnly) FString District; };

USTRUCT(BlueprintType)
struct FDynamicWorldEvent { GENERATED_BODY() UPROPERTY(BlueprintReadOnly) FString EventId; UPROPERTY(BlueprintReadOnly) FString District; UPROPERTY(BlueprintReadOnly) bool bActive=false; UPROPERTY(BlueprintReadOnly) float Heat=0.f; };
