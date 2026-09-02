#pragma once
#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "NPCScheduleSubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UNPCScheduleSubsystem : public UWorldSubsystem
{
 GENERATED_BODY()
public:
 UFUNCTION(BlueprintCallable) void UpdateSchedules(int32 GameHour);
 UFUNCTION(BlueprintPure) FString GetPhaseForProfile(const FString& ProfileId,int32 GameHour) const;
};
