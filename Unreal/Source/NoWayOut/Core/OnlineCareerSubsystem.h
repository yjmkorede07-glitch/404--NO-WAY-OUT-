#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "OnlineCareerTypes.h"
#include "OnlineCareerSubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UOnlineCareerSubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable) bool CreateCharacter(const FString& PlayerId, const FString& DisplayName);
    UFUNCTION(BlueprintCallable) void ChooseWorld(const FString& WorldId);
    UFUNCTION(BlueprintCallable) void ChooseLegitimateLife();
    UFUNCTION(BlueprintCallable) void ChooseCriminalLife(ECriminalSpecialization Specialization);
    UFUNCTION(BlueprintCallable) void ApplyForLawEnforcement();
    UFUNCTION(BlueprintCallable) void SetLawEnforcementDecision(bool bAccepted);
    UFUNCTION(BlueprintCallable) void SetRecommendedDistrict(const FString& DistrictId);
    UFUNCTION(BlueprintCallable) void CompleteHousePurchase();
    UFUNCTION(BlueprintCallable) void CompleteCitizenId();
    UFUNCTION(BlueprintCallable) void CompleteStarterVehiclePurchase();
    UFUNCTION(BlueprintPure) bool CanStartOnboardingMission() const;
    UFUNCTION(BlueprintPure) bool IsOnboardingComplete() const;
    UFUNCTION(BlueprintPure) const FOnlineCareerProfile& GetProfile() const { return Profile; }
    UFUNCTION(BlueprintPure) int64 GetStartingGrant() const { return Profile.StartingGrant; }
    UFUNCTION(BlueprintCallable) void ResetCareer();
private:
    UPROPERTY() FOnlineCareerProfile Profile;
    UPROPERTY() FString DisplayName;
};
