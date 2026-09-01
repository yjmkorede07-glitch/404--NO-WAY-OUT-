#include "WorldSimSubsystem.h"

void UNOWAYOUTWORLDSIMSUBSYSTEM::SetWeather(FName WeatherName, float Intensity)
{
    State.Weather = WeatherName;
    State.WeatherIntensity = FMath::Clamp(Intensity, 0.f, 1.f);
}

void UNOWAYOUTWORLDSIMSUBSYSTEM::ApplyDistrictPressure(FName District, float Delta)
{
    DistrictPressure.FindOrAdd(District) = FMath::Clamp(GetDistrictPressure(District) + Delta, 0.f, 100.f);
    State.Emergency = 0.f;
    for (const auto& Pair : DistrictPressure) State.Emergency += Pair.Value;
    if (DistrictPressure.Num() > 0) State.Emergency /= DistrictPressure.Num();
}

float UNOWAYOUTWORLDSIMSUBSYSTEM::GetDistrictPressure(FName District) const
{
    const float* Found = DistrictPressure.Find(District);
    return Found ? *Found : 0.f;
}
