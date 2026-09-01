#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "PoliceSubsystem.generated.h"

UENUM(BlueprintType)
enum class ENWOPoliceState : uint8 { Clear, Suspicious, Searching, Pursuit, HeavyResponse, Manhunt };

UCLASS()
class NOWAYOUT_API UNOWAYOUTPOLICESUBSYSTEM : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable, Category="404|Police") void ReportIncident(FName District, int32 Severity, bool bWitness, bool bEvidence);
    UFUNCTION(BlueprintCallable, Category="404|Police") void SetWantedLevel(int32 Level);
    UFUNCTION(BlueprintCallable, Category="404|Police") void ReduceWanted(int32 Amount);
    UFUNCTION(BlueprintPure, Category="404|Police") int32 GetWantedLevel() const { return WantedLevel; }
    UFUNCTION(BlueprintPure, Category="404|Police") ENWOPoliceState GetPoliceState() const { return State; }
private:
    UPROPERTY() int32 WantedLevel = 0;
    UPROPERTY() ENWOPoliceState State = ENWOPoliceState::Clear;
    void RefreshState();
};
