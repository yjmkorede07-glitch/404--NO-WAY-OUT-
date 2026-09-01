#pragma once
#include "CoreMinimal.h"
#include "GameFramework/PlayerState.h"
#include "NoWayOutMissionTypes.h"
#include "NoWayOutPlayerState.generated.h"

UCLASS()
class NOWAYOUT_API ANOWAYOUTPLAYERSTATE : public APlayerState
{
    GENERATED_BODY()
public:
    UPROPERTY(Replicated, BlueprintReadOnly, Category="404|Protagonist")
    ENWOProtagonist ActiveProtagonist = ENWOProtagonist::Darius;

    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;
    void SetActiveProtagonist(ENWOProtagonist NewProtagonist);
};
