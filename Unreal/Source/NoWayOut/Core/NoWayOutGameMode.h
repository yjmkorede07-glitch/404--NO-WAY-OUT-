#pragma once
#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "NoWayOutGameMode.generated.h"

UCLASS()
class NOWAYOUT_API ANOWAYOUTGAMEMODE : public AGameModeBase
{
    GENERATED_BODY()
public:
    ANOWAYOUTGAMEMODE();
    virtual void StartPlay() override;
};
