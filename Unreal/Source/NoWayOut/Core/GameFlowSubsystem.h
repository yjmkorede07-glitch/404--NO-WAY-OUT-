#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "GameFlowSubsystem.generated.h"

UENUM(BlueprintType)
enum class ENoWayOutGameMode : uint8 { Story, Online };

UENUM(BlueprintType)
enum class ENoWayOutLoadingState : uint8 { None, Booting, Profile, World, District, Interior, Mission, Cinematic, OnlineConnect, OnlineReconnect, ReturnToWorld };

UENUM(BlueprintType)
enum class ENoWayOutBootState : uint8 { Cold, Initializing, Ready, Failed };

UCLASS()
class NOWAYOUT_API UGameFlowSubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    void SetMode(ENoWayOutGameMode InMode) { Mode = InMode; }
    ENoWayOutGameMode GetMode() const { return Mode; }
    void SetLoadingState(ENoWayOutLoadingState InState) { LoadingState = InState; }
    ENoWayOutLoadingState GetLoadingState() const { return LoadingState; }
    void SetBootState(ENoWayOutBootState InState) { BootState = InState; }
    ENoWayOutBootState GetBootState() const { return BootState; }
    void SetRequestedMission(FName InMissionId) { RequestedMissionId = InMissionId; }
    FName GetRequestedMission() const { return RequestedMissionId; }

private:
    UPROPERTY() ENoWayOutGameMode Mode = ENoWayOutGameMode::Story;
    UPROPERTY() ENoWayOutLoadingState LoadingState = ENoWayOutLoadingState::None;
    UPROPERTY() ENoWayOutBootState BootState = ENoWayOutBootState::Cold;
    UPROPERTY() FName RequestedMissionId = NAME_None;
};
