#pragma once
#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "NPCPoliceSimulation.generated.h"

UENUM(BlueprintType) enum class EPoliceResponseState:uint8 { Patrol, Dispatch, Respond, Pursuit, Search, Arrest, Recover };
UCLASS() class NOWAYOUT_API UNPCPoliceSimulation : public UWorldSubsystem
{ GENERATED_BODY() public: UFUNCTION(BlueprintCallable) void ReportIncident(const FString& District,float Severity); UFUNCTION(BlueprintPure) bool IsActive() const { return true; } private: TMap<FString,float> DistrictHeat; };
