#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "EconomySubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UNOWAYOUTECONOMYSUBSYSTEM : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable, Category="404|Economy") void AddCash(int64 Amount);
    UFUNCTION(BlueprintCallable, Category="404|Economy") bool SpendCash(int64 Amount);
    UFUNCTION(BlueprintPure, Category="404|Economy") int64 GetCash() const { return Cash; }
    UFUNCTION(BlueprintCallable, Category="404|Economy") void AddReputation(int32 Amount);
    UFUNCTION(BlueprintPure, Category="404|Economy") int32 GetReputation() const { return Reputation; }
private:
    UPROPERTY() int64 Cash = 0;
    UPROPERTY() int32 Reputation = 0;
};
