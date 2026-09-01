#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "WorldSimSubsystem.generated.h"

USTRUCT(BlueprintType)
struct FNWOWorldSimState
{
    GENERATED_BODY()
    UPROPERTY(BlueprintReadOnly) float Traffic = 50.f;
    UPROPERTY(BlueprintReadOnly) float Crowd = 50.f;
    UPROPERTY(BlueprintReadOnly) float Emergency = 0.f;
    UPROPERTY(BlueprintReadOnly) float BusinessActivity = 55.f;
    UPROPERTY(BlueprintReadOnly) float WeatherIntensity = 0.1f;
    UPROPERTY(BlueprintReadOnly) FName Weather = TEXT("clear");
};

UCLASS()
class NOWAYOUT_API UNOWAYOUTWORLDSIMSUBSYSTEM : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UPROPERTY(BlueprintReadOnly, Category="404|World") FNWOWorldSimState State;
    UFUNCTION(BlueprintCallable, Category="404|World") void SetWeather(FName WeatherName, float Intensity);
    UFUNCTION(BlueprintCallable, Category="404|World") void ApplyDistrictPressure(FName District, float Delta);
    UFUNCTION(BlueprintPure, Category="404|World") float GetDistrictPressure(FName District) const;
private:
    UPROPERTY() TMap<FName, float> DistrictPressure;
};
