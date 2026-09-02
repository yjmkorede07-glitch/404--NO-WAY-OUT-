#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "LawEnforcementCareerTypes.h"
#include "LawEnforcementSubsystem.generated.h"

UCLASS()
class NOWAYOUT_API ULawEnforcementSubsystem : public UGameInstanceSubsystem {
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable) bool CanUseAction(const FString& Action) const;
    UFUNCTION(BlueprintCallable) void SetAccepted(bool bAccepted, ELawEnforcementRank InRank);
    UFUNCTION(BlueprintCallable) bool RequestEmergencyService(const FString& Service, const FString& IncidentId);
private:
    bool bAccepted = false;
    ELawEnforcementRank Rank = ELawEnforcementRank::Cadet;
};
