#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "WorldSimSubsystem.generated.h"

USTRUCT(BlueprintType)
struct FNWOWorldSimState {
    GENERATED_BODY()
    UPROPERTY(BlueprintReadOnly) float Traffic = 50.f;
    UPROPERTY(BlueprintReadOnly) float Crowd = 50.f;
    UPROPERTY(BlueprintReadOnly) float Emergency = 0.f;
    UPROPERTY(BlueprintReadOnly) float BusinessActivity = 55.f;
    UPROPERTY(BlueprintReadOnly) float WeatherIntensity = 0.1f;
    UPROPERTY(BlueprintReadOnly) FName Weather = TEXT("clear");
};

UCLASS()
class UNOWAYOUTWORLDSIMSUBSYSTEM : public UGameInstanceSubsystem {
    GENERATED_BODY()
public:
    UPROPERTY(BlueprintReadOnly) FNWOWorldSimState State;
};
