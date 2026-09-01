#include "MissionAssetImportSubsystem.h"
#include "MissionDataAsset.h"
#include "Misc/FileHelper.h"
#include "Misc/Paths.h"
#include "Serialization/JsonReader.h"
#include "Serialization/JsonSerializer.h"
#include "AssetRegistry/AssetRegistryModule.h"
#include "UObject/Package.h"
#include "UObject/SavePackage.h"
#include "Misc/Crc.h"

void UNOWAYOUTEDITOR_MISSIONIMPORTSUBSYSTEM::Initialize(FSubsystemCollectionBase& Collection)
{
    Super::Initialize(Collection);
    ImportCampaignMissionAssets(false);
}

static FName JsonName(const TSharedPtr<FJsonObject>& O, const TCHAR* K)
{ FString V; return O->TryGetStringField(K, V) ? FName(*V) : NAME_None; }
static FText JsonText(const TSharedPtr<FJsonObject>& O, const TCHAR* K)
{ FString V; return O->TryGetStringField(K, V) ? FText::FromString(V) : FText::GetEmpty(); }
static TArray<FString> JsonStrings(const TSharedPtr<FJsonObject>& O, const TCHAR* K)
{ TArray<FString> Out; const TArray<TSharedPtr<FJsonValue>>* A=nullptr; if(O->TryGetArrayField(K,A)) for(const auto& V:*A) Out.Add(V->AsString()); return Out; }
static void FillNames(const TSharedPtr<FJsonObject>& O, const TCHAR* K, TArray<FName>& Out)
{ for(const FString& S:JsonStrings(O,K)) Out.Add(FName(*S)); }

int32 UNOWAYOUTEDITOR_MISSIONIMPORTSUBSYSTEM::ImportCampaignMissionAssets(bool bForceRefresh)
{
    const FString Dir=FPaths::Combine(FPaths::ProjectContentDir(),TEXT("Data/Missions"));
    TArray<FString> Files; IFileManager::Get().FindFiles(Files,*FPaths::Combine(Dir,TEXT("M*.json")),true,false);
    int32 Imported=0; for(const FString& File:Files) Imported+=ImportOne(FPaths::Combine(Dir,File),bForceRefresh); return Imported;
}

int32 UNOWAYOUTEDITOR_MISSIONIMPORTSUBSYSTEM::ImportOne(const FString& JsonPath,bool bForceRefresh)
{
    FString Json; if(!FFileHelper::LoadFileToString(Json,*JsonPath)) return 0;
    TSharedPtr<FJsonObject> O; const TSharedRef<TJsonReader<>> Reader=TJsonReaderFactory<>::Create(Json);
    if(!FJsonSerializer::Deserialize(Reader,O)||!O.IsValid()) return 0;
    const FName Id=JsonName(O,TEXT("id")); if(Id.IsNone()) return 0;
    const FString PackageName=FString::Printf(TEXT("/Game/Data/Missions/%s"),*Id.ToString());
    UPackage* Package=CreatePackage(*PackageName); if(!Package) return 0;
    UNOWAYOUTMISSIONDATAASSET* Asset=FindObject<UNOWAYOUTMISSIONDATAASSET>(Package,*Id.ToString());
    const FString Revision=FString::Printf(TEXT("%08X:%d"), FCrc::StrCrc32(*Json), Json.Len());
    if(Asset&&!bForceRefresh&&Asset->SourceRevision==Revision) return 0;
    if(!Asset) Asset=NewObject<UNOWAYOUTMISSIONDATAASSET>(Package,*Id.ToString(),RF_Public|RF_Standalone); if(!Asset) return 0;
    Asset->MissionId=Id; Asset->Title=JsonText(O,TEXT("title")); Asset->Brief=JsonText(O,TEXT("brief")); Asset->WinCondition=JsonText(O,TEXT("win_condition"));
    Asset->Protagonist=JsonName(O,TEXT("protagonist")); Asset->Location=JsonName(O,TEXT("location"));
    Asset->Prerequisites.Reset(); FillNames(O,TEXT("required_previous_missions"),Asset->Prerequisites);
    Asset->SupportingNPCs.Reset(); FillNames(O,TEXT("supporting_npcs"),Asset->SupportingNPCs);
    Asset->FailureConditions=JsonStrings(O,TEXT("failure_conditions")); Asset->SuccessConditions=JsonStrings(O,TEXT("success_conditions"));
    Asset->UnlockedContent.Reset(); FillNames(O,TEXT("unlocked_content"),Asset->UnlockedContent);
    Asset->PrototypeSteps.Reset(); const TArray<TSharedPtr<FJsonValue>>* Steps=nullptr;
    if(O->TryGetArrayField(TEXT("prototype_steps"),Steps)) for(const auto& V:*Steps){const auto S=V->AsObject();if(!S.IsValid())continue;FNWOMissionStep Step;Step.StepId=JsonName(S,TEXT("id"));Step.Kind=JsonName(S,TEXT("kind"));Step.Target=JsonName(S,TEXT("target"));Step.Text=JsonText(S,TEXT("text"));Asset->PrototypeSteps.Add(Step);}
    Asset->OptionalObjectives.Reset(); const TArray<TSharedPtr<FJsonValue>>* Optional=nullptr;
    if(O->TryGetArrayField(TEXT("optional_objectives"),Optional)) for(const auto& V:*Optional){const auto P=V->AsObject();if(!P.IsValid())continue;FNWOMissionObjective Obj;Obj.ObjectiveId=JsonName(P,TEXT("id"));Obj.Text=JsonText(P,TEXT("text"));Obj.bOptional=true;P->TryGetNumberField(TEXT("points"),Obj.Points);Asset->OptionalObjectives.Add(Obj);}
    const TSharedPtr<FJsonObject>* Score=nullptr; if(O->TryGetObjectField(TEXT("score_weights"),Score)&&Score){(*Score)->TryGetNumberField(TEXT("critical"),Asset->Score.Critical);(*Score)->TryGetNumberField(TEXT("optional"),Asset->Score.Optional);(*Score)->TryGetNumberField(TEXT("time"),Asset->Score.Time);(*Score)->TryGetNumberField(TEXT("survival"),Asset->Score.Survival);(*Score)->TryGetNumberField(TEXT("precision"),Asset->Score.Precision);}
    const TSharedPtr<FJsonObject>* Rewards=nullptr; if(O->TryGetObjectField(TEXT("rewards"),Rewards)&&Rewards){(*Rewards)->TryGetNumberField(TEXT("cash"),Asset->Rewards.Cash);(*Rewards)->TryGetNumberField(TEXT("reputation"),Asset->Rewards.Reputation);}
    Asset->Consequences.Reset(); const TSharedPtr<FJsonObject>* C=nullptr; if(O->TryGetObjectField(TEXT("consequences"),C)&&C) for(const auto& Pair:(*C)->Values) Asset->Consequences.Add(FName(*Pair.Key),Pair.Value->AsNumber());
    Asset->SourceRevision=Revision; Asset->MarkPackageDirty(); FAssetRegistryModule::AssetCreated(Asset);
    const FString Filename=FPackageName::LongPackageNameToFilename(PackageName,FPackageName::GetAssetPackageExtension()); FSavePackageArgs Args; Args.TopLevelFlags=RF_Public|RF_Standalone; UPackage::SavePackage(Package,Asset,*Filename,Args);
    return 1;
}
