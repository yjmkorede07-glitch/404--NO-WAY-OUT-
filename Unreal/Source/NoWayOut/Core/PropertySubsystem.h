#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "PropertyEconomyTypes.h"
#include "PropertySubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UPropertySubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable, Category="404|Property") bool PurchaseProperty(const FPropertyRecord& Property);
    UFUNCTION(BlueprintCallable, Category="404|Property") bool OwnsProperty(FName PropertyId) const;
    UFUNCTION(BlueprintCallable, Category="404|Property") bool UpgradeProperty(FName PropertyId, int64 Cost, int32 SecurityDelta, int32 StorageDelta);
    UFUNCTION(BlueprintPure, Category="404|Property") const TArray<FPropertyRecord>& GetProperties() const { return Properties; }
private:
    UPROPERTY() TArray<FPropertyRecord> Properties;
};
