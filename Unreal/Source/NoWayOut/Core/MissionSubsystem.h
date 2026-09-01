#pragma once

#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "MissionDataAsset.h"
#include "MissionSubsystem.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FNWOOnMissionStateChanged, FName, MissionId);

UCLASS()
class NOWAYOUT_API UNOWAYOUTMISSIONSUBSYSTEM : public UGameInstanceSubsystem
{
    GENERATED_BODY()

public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;

    UFUNCTION(BlueprintCallable, Category="404|Missions") bool LoadMissionManifest();
    UFUNCTION(BlueprintPure, Category="404|Missions") const UNOWAYOUTMISSIONDATAASSET* GetMission(FName MissionId) const;
    UFUNCTION(BlueprintPure, Category="404|Missions") ENWOMissionState GetMissionState(FName MissionId) const;
    UFUNCTION(BlueprintCallable, Category="404|Missions") bool SetMissionState(FName MissionId, ENWOMissionState NewState);
    UFUNCTION(BlueprintPure, Category="404|Missions") TArray<FName> GetAvailableMissions() const;
    UFUNCTION(BlueprintCallable, Category="404|Missions") bool StartMission(FName MissionId);
    UFUNCTION(BlueprintCallable, Category="404|Missions") bool CompleteMission(FName MissionId);
    UFUNCTION(BlueprintCallable, Category="404|Missions") bool FailMission(FName MissionId);

    UPROPERTY(BlueprintAssignable, Category="404|Missions") FNWOOnMissionStateChanged OnMissionStateChanged;

private:
    UPROPERTY() TMap<FName, TObjectPtr<UNOWAYOUTMISSIONDATAASSET>> Missions;
    UPROPERTY() TMap<FName, ENWOMissionState> MissionStates;
    bool ArePrerequisitesComplete(const UNOWAYOUTMISSIONDATAASSET& Mission) const;
    bool ParseManifest(const FString& JsonText);
};
