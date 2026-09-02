#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "FreemodeActivityTypes.h"
#include "FreemodeActivitySubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UFreemodeActivitySubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable) bool StartActivity(FName ActivityId, const FName LocationId);
    UFUNCTION(BlueprintCallable) bool AdvanceActivity(FName ActivityId, EFreemodeActivityState RequestedState);
    UFUNCTION(BlueprintCallable) bool ResolveActivity(FName ActivityId, bool bSuccess);
    UFUNCTION(BlueprintPure) const TArray<FFreemodeActivityInstance>& GetActiveActivities() const { return ActiveActivities; }
    void LoadDefinitionsFromJson(const FString& JsonText);
private:
    UPROPERTY() TArray<FFreemodeActivityDefinition> Definitions;
    UPROPERTY() TArray<FFreemodeActivityInstance> ActiveActivities;
};
