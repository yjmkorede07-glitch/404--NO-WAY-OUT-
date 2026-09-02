#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "CoreGameplayInteractionSubsystem.generated.h"

UENUM(BlueprintType)
enum class ENoWayOutInteraction : uint8 {
    Talk, EnterVehicle, ExitVehicle, PlateCheck, CitizenIdCheck, Detain, Arrest,
    RequestBackup, RequestAmbulance, RequestFire, RequestTow, Business, Property,
    BankATM, Robbery, VehicleTheft, Purchase, MissionTrigger
};

USTRUCT(BlueprintType)
struct FInteractionRequest {
    GENERATED_BODY()
    UPROPERTY(BlueprintReadWrite) FString ActorId;
    UPROPERTY(BlueprintReadWrite) FString TargetId;
    UPROPERTY(BlueprintReadWrite) ENoWayOutInteraction Type = ENoWayOutInteraction::Talk;
    UPROPERTY(BlueprintReadWrite) float Distance = 0.f;
};

UCLASS()
class NOWAYOUT_API UCoreGameplayInteractionSubsystem : public UGameInstanceSubsystem {
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable) bool CanInteract(const FInteractionRequest& Request) const;
    UFUNCTION(BlueprintCallable) bool ExecuteInteraction(const FInteractionRequest& Request, FString& FailureReason);
};
