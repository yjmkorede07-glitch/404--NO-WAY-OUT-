#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "OnlineTimeSubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UOnlineTimeSubsystem : public UGameInstanceSubsystem {
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintPure) float GetRealMinutesPerGameHour() const { return 5.0f; }
    UFUNCTION(BlueprintPure) float GetGameHoursPerRealHour() const { return 12.0f; }
    UFUNCTION(BlueprintPure) float GetGameDaysPerRealDay() const { return 12.0f; }
};
