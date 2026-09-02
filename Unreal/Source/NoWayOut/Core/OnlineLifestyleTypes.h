#pragma once
#include "CoreMinimal.h"
#include "OnlineLifestyleTypes.generated.h"

UENUM(BlueprintType)
enum class EOnlineLifestyle : uint8 { Legitimate, Criminal, LawEnforcement };

USTRUCT(BlueprintType)
struct FOnlineLifestyleState {
    GENERATED_BODY()
    UPROPERTY(BlueprintReadOnly) EOnlineLifestyle Lifestyle = EOnlineLifestyle::Legitimate;
    UPROPERTY(BlueprintReadOnly) int64 LastChangedUnixMs = 0;
    UPROPERTY(BlueprintReadOnly) int32 CooldownRealMinutes = 120;
    UPROPERTY(BlueprintReadOnly) bool bPendingAcceptance = false;
    UPROPERTY(BlueprintReadOnly) bool bOpeningIntroSeen = false;
    UPROPERTY(BlueprintReadOnly) bool bPostChoiceCinematicSeen = false;
};
