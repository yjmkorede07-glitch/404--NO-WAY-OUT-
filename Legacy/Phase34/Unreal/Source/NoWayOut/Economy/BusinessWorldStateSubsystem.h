#pragma once
#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "BusinessWorldStateSubsystem.generated.h"
USTRUCT(BlueprintType) struct FBusinessWorldState { GENERATED_BODY() UPROPERTY(BlueprintReadOnly) FString BusinessId; UPROPERTY(BlueprintReadOnly) bool bOpen=true; UPROPERTY(BlueprintReadOnly) bool bOffBookAvailable=false; UPROPERTY(BlueprintReadOnly) float Heat=0.f; };
UCLASS() class NOWAYOUT_API UBusinessWorldStateSubsystem : public UWorldSubsystem { GENERATED_BODY() public: UFUNCTION(BlueprintCallable) void SetBusinessOpen(const FString& Id,bool bOpen); UFUNCTION(BlueprintCallable) void SetOffBookAvailable(const FString& Id,bool bAvailable); UFUNCTION(BlueprintCallable) void AddBusinessHeat(const FString& Id,float Amount); private: TMap<FString,FBusinessWorldState> States; };
