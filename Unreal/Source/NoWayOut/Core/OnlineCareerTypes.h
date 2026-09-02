#pragma once
#include "CoreMinimal.h"
#include "OnlineCareerTypes.generated.h"

UENUM(BlueprintType)
enum class EOnlineLifePath : uint8
{
    Legitimate,
    Criminal,
    LawEnforcement
};

UENUM(BlueprintType)
enum class ECriminalSpecialization : uint8
{
    None,
    StreetCrew,
    HeistOperator,
    Smuggler,
    VehicleThief,
    Fixer,
    CyberBroker
};

UENUM(BlueprintType)
enum class ELawEnforcementStatus : uint8
{
    NotApplied,
    PendingReview,
    Accepted,
    Rejected
};

USTRUCT(BlueprintType)
struct FOnlineCareerProfile
{
    GENERATED_BODY()
    UPROPERTY(BlueprintReadWrite) FString PlayerId;
    UPROPERTY(BlueprintReadWrite) FString CitizenId;
    UPROPERTY(BlueprintReadWrite) FString WorldId;
    UPROPERTY(BlueprintReadWrite) FString HomeDistrict;
    UPROPERTY(BlueprintReadWrite) EOnlineLifePath LifePath = EOnlineLifePath::Legitimate;
    UPROPERTY(BlueprintReadWrite) ECriminalSpecialization CriminalSpecialization = ECriminalSpecialization::None;
    UPROPERTY(BlueprintReadWrite) ELawEnforcementStatus LawEnforcementStatus = ELawEnforcementStatus::NotApplied;
    UPROPERTY(BlueprintReadWrite) int64 StartingGrant = 10000000;
    UPROPERTY(BlueprintReadWrite) bool bCharacterCreated = false;
    UPROPERTY(BlueprintReadWrite) bool bHousePurchased = false;
    UPROPERTY(BlueprintReadWrite) bool bIdObtained = false;
    UPROPERTY(BlueprintReadWrite) bool bStarterVehicleOwned = false;
    UPROPERTY(BlueprintReadWrite) bool bOnboardingComplete = false;
};
