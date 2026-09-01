#pragma once
#include "CoreMinimal.h"
#include "GameFramework/GameStateBase.h"
#include "NoWayOutMissionTypes.h"
#include "NoWayOutGameState.generated.h"

UCLASS()
class NOWAYOUT_API ANOWAYOUTGAMESTATE : public AGameStateBase
{
    GENERATED_BODY()
public:
    UPROPERTY(Replicated, BlueprintReadOnly, Category="404|Story") FName ActiveMissionId = NAME_None;
    UPROPERTY(Replicated, BlueprintReadOnly, Category="404|Story") ENWOProtagonist ActiveProtagonist = ENWOProtagonist::Darius;
    UPROPERTY(Replicated, BlueprintReadOnly, Category="404|Story") FString EndingId;
    UPROPERTY(Replicated, BlueprintReadOnly, Category="404|Story") bool bFreeRoamUnlocked = false;

    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;
};
