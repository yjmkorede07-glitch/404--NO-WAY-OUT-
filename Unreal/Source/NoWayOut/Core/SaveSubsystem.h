#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "GameFramework/SaveGame.h"
#include "SaveSubsystem.generated.h"

UCLASS()
class NOWAYOUT_API UNOWAYOUTSAVEGAME : public USaveGame
{
    GENERATED_BODY()
public:
    UPROPERTY() int32 Version = 1;
    UPROPERTY() FString EndingId;
    UPROPERTY() bool bFreeRoamUnlocked = false;
    UPROPERTY() TMap<FString, int32> MissionStates;
    UPROPERTY() TMap<FString, int32> StoryFlags;
    UPROPERTY() int64 Cash = 0;
    UPROPERTY() int32 Reputation = 0;
};

UCLASS()
class NOWAYOUT_API UNOWAYOUTSAVESUBSYSTEM : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable, Category="404|Save") bool SaveStoryState(const FString& SlotName = TEXT("Story_0"));
    UFUNCTION(BlueprintCallable, Category="404|Save") bool LoadStoryState(const FString& SlotName = TEXT("Story_0"));
    UFUNCTION(BlueprintPure, Category="404|Save") bool IsFreeRoamUnlocked() const { return bFreeRoamUnlocked; }
    UFUNCTION(BlueprintCallable, Category="404|Save") void SetEnding(const FString& EndingId);
private:
    UPROPERTY() FString EndingId;
    UPROPERTY() bool bFreeRoamUnlocked = false;
};
