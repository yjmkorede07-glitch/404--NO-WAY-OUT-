#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "PropertyEconomyTypes.h"
#include "MarketSubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UMarketSubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable, Category="404|Market") void SetPrice(FName Symbol, double Price);
    UFUNCTION(BlueprintPure, Category="404|Market") double GetPrice(FName Symbol) const;
    UFUNCTION(BlueprintCallable, Category="404|Market") bool BuyShares(FName Symbol, int32 Shares);
    UFUNCTION(BlueprintCallable, Category="404|Market") bool SellShares(FName Symbol, int32 Shares);
    UFUNCTION(BlueprintPure, Category="404|Market") TArray<FStockHolding> GetHoldings() const { return Holdings; }
private:
    UPROPERTY() TMap<FName,double> Prices;
    UPROPERTY() TArray<FStockHolding> Holdings;
};
