#pragma once
#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "NoWayOutPlayerController.generated.h"

UCLASS()
class NOWAYOUT_API ANOWAYOUTPLAYERCONTROLLER : public APlayerController
{
    GENERATED_BODY()
public:
    virtual void BeginPlay() override;
};
