#include "WeatherSubsystem.h"
void UWeatherSubsystem::SetWeather(EVeyronWeather NewWeather) { CurrentWeather = NewWeather; }
void UWeatherSubsystem::SetSnowAccumulation(float Amount) { SnowAccumulation = FMath::Clamp(Amount, 0.0f, 1.0f); }
