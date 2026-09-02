#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "OnlineIdentitySubsystem.generated.h"

USTRUCT(BlueprintType)
struct FOnlinePlayerIdentity
{
    GENERATED_BODY()
    UPROPERTY(BlueprintReadWrite) FString PlayerId;
    UPROPERTY(BlueprintReadWrite) FString DisplayName;
    UPROPERTY(BlueprintReadWrite) FString CitizenId;
    UPROPERTY(BlueprintReadWrite) FString WorldId;
    UPROPERTY(BlueprintReadWrite) FString HomeDistrict;
    UPROPERTY(BlueprintReadWrite) bool bIdActive = false;
};

UCLASS()
class NOWAYOUT_API UOnlineIdentitySubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable) void SetIdentity(const FOnlinePlayerIdentity& InIdentity);
    UFUNCTION(BlueprintPure) const FOnlinePlayerIdentity& GetIdentity() const { return Identity; }
    UFUNCTION(BlueprintCallable) void ClearIdentity();
private:
    UPROPERTY() FOnlinePlayerIdentity Identity;
};
