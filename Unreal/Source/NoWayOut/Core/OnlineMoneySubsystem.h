#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "OnlineMoneySubsystem.generated.h"

USTRUCT(BlueprintType)
struct FMoneyTransferRequest
{
    GENERATED_BODY()
    UPROPERTY(BlueprintReadWrite) FString RecipientPlayerId;
    UPROPERTY(BlueprintReadWrite) int64 Amount = 0;
    UPROPERTY(BlueprintReadWrite) FString IdempotencyKey;
};

UCLASS()
class NOWAYOUT_API UOnlineMoneySubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable) bool CanRequestTransfer(const FMoneyTransferRequest& Request) const;
    UFUNCTION(BlueprintCallable) void MarkTransferPending(const FString& IdempotencyKey);
    UFUNCTION(BlueprintCallable) void MarkTransferResolved(const FString& IdempotencyKey, bool bSuccess);
private:
    UPROPERTY() TSet<FString> PendingKeys;
    UPROPERTY() TSet<FString> ResolvedKeys;
};
