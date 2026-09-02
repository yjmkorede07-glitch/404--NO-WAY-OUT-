#pragma once
#include "CoreMinimal.h"
#include "FreemodeActivityTypes.generated.h"

UENUM(BlueprintType)
enum class EFreemodeActivityType : uint8
{
    BankRobbery,
    StoreRobbery,
    ArmoredTransport,
    CashPickup,
    VehicleTheft,
    TerritoryEvent,
    PoliceIntercept
};

UENUM(BlueprintType)
enum class EFreemodeActivityState : uint8
{
    Discoverable,
    Approach,
    Active,
    SecurityResponse,
    Escape,
    PoliceResponse,
    Resolved,
    Cooldown
};

USTRUCT(BlueprintType)
struct FFreemodeActivityDefinition
{
    GENERATED_BODY()
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FName ActivityId;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) EFreemodeActivityType Type = EFreemodeActivityType::BankRobbery;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FName LocationId;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 MinPlayers = 1;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 MaxPlayers = 4;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 BaseReward = 0;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 HeatGain = 0;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 CooldownSeconds = 0;
};

USTRUCT(BlueprintType)
struct FFreemodeActivityInstance
{
    GENERATED_BODY()
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly) FGuid InstanceId;
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly) FName ActivityId;
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly) EFreemodeActivityState State = EFreemodeActivityState::Discoverable;
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly) int32 ServerRevision = 0;
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly) int32 CurrentReward = 0;
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly) int32 Heat = 0;
};
