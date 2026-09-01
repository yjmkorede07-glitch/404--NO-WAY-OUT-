#pragma once

#include "CoreMinimal.h"
#include "Engine/GameInstance.h"
#include "NoWayOutGameInstance.generated.h"

UCLASS()
class NOWAYOUT_API UNOWAYOUTGAMEINSTANCE : public UGameInstance
{
    GENERATED_BODY()

public:
    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="404|Data") FString MissionManifestRelativePath = TEXT("Data/campaign_88_missions.json");
};
