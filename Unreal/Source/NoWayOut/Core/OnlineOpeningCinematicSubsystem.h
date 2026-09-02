#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "OnlineOpeningCinematicSubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UOnlineOpeningCinematicSubsystem : public UGameInstanceSubsystem {
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintPure) FName GetOpeningBeforeLifeCinematic() const { return TEXT("OC_01_WelcomeToVeyron"); }
    UFUNCTION(BlueprintPure) FName GetOpeningAfterLifeCinematic() const { return TEXT("OC_02_YourLifeStartsHere"); }
};
