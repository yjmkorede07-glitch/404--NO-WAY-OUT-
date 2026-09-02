#pragma once
#include "CoreMinimal.h"
#include "PropertyEconomyTypes.generated.h"

UENUM(BlueprintType)
enum class EPropertyType : uint8 { Safehouse, Apartment, House, Garage, Warehouse, Office, Nightclub, Retail, Industrial, Hangar, MountainLodge };

USTRUCT(BlueprintType)
struct FPropertyRecord
{
    GENERATED_BODY()
    UPROPERTY(EditAnywhere, BlueprintReadWrite) FName PropertyId;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) EPropertyType Type = EPropertyType::House;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) FName LocationId;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) int64 PurchasePrice = 0;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) bool bOwned = false;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) int32 SecurityLevel = 0;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) int32 StorageCapacity = 0;
};

USTRUCT(BlueprintType)
struct FStockHolding
{
    GENERATED_BODY()
    UPROPERTY(EditAnywhere, BlueprintReadWrite) FName Symbol;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) int32 Shares = 0;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) double AveragePrice = 0.0;
};

USTRUCT(BlueprintType)
struct FConstructionProject
{
    GENERATED_BODY()
    UPROPERTY(EditAnywhere, BlueprintReadWrite) FName ProjectId;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) FName PropertyOrPlotId;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) FName ConstructionState;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) float Progress = 0.0f;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) int64 ContractValue = 0;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) bool bComplete = false;
};
