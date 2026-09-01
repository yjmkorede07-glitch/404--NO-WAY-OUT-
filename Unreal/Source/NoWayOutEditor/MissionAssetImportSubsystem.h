#pragma once
#include "CoreMinimal.h"
#include "EditorSubsystem.h"
#include "MissionAssetImportSubsystem.generated.h"

UCLASS()
class NOWAYOUTEDITOR_API UNOWAYOUTEDITOR_MISSIONIMPORTSUBSYSTEM : public UEditorSubsystem
{
    GENERATED_BODY()
public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;
    UFUNCTION(BlueprintCallable, CallInEditor, Category="404|Migration") int32 ImportCampaignMissionAssets(bool bForceRefresh = false);
private:
    int32 ImportOne(const FString& JsonPath, bool bForceRefresh);
};
