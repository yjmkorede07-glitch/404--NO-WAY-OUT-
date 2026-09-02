#pragma once
#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "NoWayOutMissionTypes.h"
#include "ProtagonistDataAsset.generated.h"

UCLASS(BlueprintType)
class NOWAYOUT_API UNOWAYOUTPROTAGONISTDATAASSET : public UPrimaryDataAsset
{
    GENERATED_BODY()
public:
    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="404|Identity") ENWOProtagonist Protagonist = ENWOProtagonist::Darius;
    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="404|Identity") FName CharacterId;
    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="404|Identity") FText DisplayName;
    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="404|Identity") FText Personality;
    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="404|Identity") TArray<FName> GameplayTags;
    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="404|Presentation") TObjectPtr<USkeletalMesh> BodyMesh;
    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="404|Presentation") TSubclassOf<UAnimInstance> AnimationBlueprint;
};
