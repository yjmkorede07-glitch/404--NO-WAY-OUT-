#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "OnlineLifestyleTypes.h"
#include "OnlineLifestyleSubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UOnlineLifestyleSubsystem : public UGameInstanceSubsystem {
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable) bool CanChangeLifestyle() const;
    UFUNCTION(BlueprintCallable) bool RequestLifestyleChange(EOnlineLifestyle NewLifestyle);
    UFUNCTION(BlueprintCallable) void SetLawEnforcementAcceptance(bool bAccepted);
    UFUNCTION(BlueprintPure) const FOnlineLifestyleState& GetState() const { return State; }
    UFUNCTION(BlueprintPure) int32 GetRemainingCooldownSeconds() const;
    UFUNCTION(BlueprintCallable) void MarkOpeningIntroSeen();
    UFUNCTION(BlueprintCallable) void MarkPostChoiceCinematicSeen();
private:
    UPROPERTY() FOnlineLifestyleState State;
};
