#pragma once
#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "WeatherSubsystem.generated.h"

UENUM(BlueprintType)
enum class EVeyronWeather : uint8 { Clear, Cloudy, Rain, HeavyRain, Fog, Storm, Snow, HeavySnow, Blizzard };

UCLASS()
class NOWAYOUT_API UWeatherSubsystem : public UWorldSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable, Category="404|Weather") void SetWeather(EVeyronWeather NewWeather);
    UFUNCTION(BlueprintPure, Category="404|Weather") EVeyronWeather GetWeather() const { return CurrentWeather; }
    UFUNCTION(BlueprintCallable, Category="404|Weather") void SetSnowAccumulation(float Amount);
    UFUNCTION(BlueprintPure, Category="404|Weather") float GetSnowAccumulation() const { return SnowAccumulation; }
private:
    UPROPERTY() EVeyronWeather CurrentWeather = EVeyronWeather::Clear;
    UPROPERTY() float SnowAccumulation = 0.0f;
};
