#pragma once

#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "NoWayOutMissionTypes.h"
#include "ProtagonistSubsystem.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FNWOOnProtagonistChanged, ENWOProtagonist, NewProtagonist);

UCLASS()
class NOWAYOUT_API UNOWAYOUTPROTAGONISTSUBSYSTEM : public UGameInstanceSubsystem
{
    GENERATED_BODY()

public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;

    UFUNCTION(BlueprintCallable, Category="404|Protagonist")
    bool SwitchProtagonist(ENWOProtagonist NewProtagonist, bool bSaveImmediately = true);

    UFUNCTION(BlueprintPure, Category="404|Protagonist")
    ENWOProtagonist GetActiveProtagonist() const { return ActiveProtagonist; }

    UFUNCTION(BlueprintPure, Category="404|Protagonist")
    bool IsPlayable(ENWOProtagonist Protagonist) const;

    UPROPERTY(BlueprintAssignable, Category="404|Protagonist")
    FNWOOnProtagonistChanged OnProtagonistChanged;

private:
    UPROPERTY()
    ENWOProtagonist ActiveProtagonist = ENWOProtagonist::Darius;
};
