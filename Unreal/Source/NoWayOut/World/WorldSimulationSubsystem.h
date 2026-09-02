#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "WorldSimulationTypes.h"
#include "WorldSimulationSubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UWorldSimulationSubsystem : public UGameInstanceSubsystem
{
 GENERATED_BODY()
public:
 UFUNCTION(BlueprintCallable) void AdvanceRealSeconds(float Seconds);
 UFUNCTION(BlueprintPure) FWorldClockState GetWorldClock() const { return Clock; }
 UFUNCTION(BlueprintCallable) void SetWeatherState(const FString& WeatherId);
 UFUNCTION(BlueprintPure) FString GetWeatherState() const { return WeatherId; }
 UFUNCTION(BlueprintCallable) void RegisterNPC(const FString& NpcId,const FString& ProfileId,const FString& District);
 UFUNCTION(BlueprintCallable) void UnregisterNPC(const FString& NpcId);
 UFUNCTION(BlueprintCallable) void RegisterDynamicEvent(const FString& EventId,const FString& District,float Heat);
 UFUNCTION(BlueprintCallable) void ResolveDynamicEvent(const FString& EventId);
 UFUNCTION(BlueprintPure) float GetTrafficDensity(const FString& District) const;
private:
 UPROPERTY() FWorldClockState Clock;
 UPROPERTY() FString WeatherId="clear";
 TMap<FString,FNPCScheduleState> NPCs;
 TMap<FString,FDynamicWorldEvent> Events;
 float Accumulator=0.f;
 void AdvanceOneGameMinute();
};
