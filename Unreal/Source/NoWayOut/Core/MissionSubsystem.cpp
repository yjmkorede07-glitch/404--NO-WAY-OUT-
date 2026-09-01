#include "MissionSubsystem.h"
#include "NoWayOutGameInstance.h"
#include "Misc/FileHelper.h"
#include "Misc/Paths.h"
#include "Serialization/JsonReader.h"
#include "Serialization/JsonSerializer.h"

namespace NWOJson
{
static FText TextField(const TSharedPtr<FJsonObject>& Obj, const TCHAR* Key)
{
    FString Value; return Obj->TryGetStringField(Key, Value) ? FText::FromString(Value) : FText::GetEmpty();
}
static FName NameField(const TSharedPtr<FJsonObject>& Obj, const TCHAR* Key)
{
    FString Value; return Obj->TryGetStringField(Key, Value) ? FName(*Value) : NAME_None;
}
static void StringArray(const TSharedPtr<FJsonObject>& Obj, const TCHAR* Key, TArray<FString>& Out)
{
    const TArray<TSharedPtr<FJsonValue>>* Values = nullptr;
    if (!Obj->TryGetArrayField(Key, Values)) return;
    for (const TSharedPtr<FJsonValue>& V : *Values) { Out.Add(V->AsString()); }
}
static void NameArray(const TSharedPtr<FJsonObject>& Obj, const TCHAR* Key, TArray<FName>& Out)
{
    TArray<FString> Values; StringArray(Obj, Key, Values);
    for (const FString& V : Values) Out.Add(FName(*V));
}
}

void UNOWAYOUTMISSIONSUBSYSTEM::Initialize(FSubsystemCollectionBase& Collection)
{
    Super::Initialize(Collection);
    LoadMissionManifest();
}

bool UNOWAYOUTMISSIONSUBSYSTEM::LoadMissionManifest()
{
    const UNOWAYOUTGAMEINSTANCE* GI = Cast<UNOWAYOUTGAMEINSTANCE>(GetGameInstance());
    const FString Relative = GI ? GI->MissionManifestRelativePath : TEXT("Data/campaign_88_missions.json");
    const FString Path = FPaths::Combine(FPaths::ProjectContentDir(), Relative);
    FString JsonText;
    if (!FFileHelper::LoadFileToString(JsonText, *Path)) return false;
    return ParseManifest(JsonText);
}

bool UNOWAYOUTMISSIONSUBSYSTEM::ParseManifest(const FString& JsonText)
{
    TSharedPtr<FJsonObject> Root;
    const TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(JsonText);
    if (!FJsonSerializer::Deserialize(Reader, Root) || !Root.IsValid()) return false;

    const TArray<TSharedPtr<FJsonValue>>* MissionValues = nullptr;
    if (!Root->TryGetArrayField(TEXT("missions"), MissionValues)) return false;

    Missions.Empty();
    MissionStates.Empty();

    for (const TSharedPtr<FJsonValue>& Value : *MissionValues)
    {
        const TSharedPtr<FJsonObject> Obj = Value->AsObject();
        if (!Obj.IsValid()) continue;
        const FName Id = NWOJson::NameField(Obj, TEXT("id"));
        if (Id.IsNone()) continue;

        UNOWAYOUTMISSIONDATAASSET* Mission = NewObject<UNOWAYOUTMISSIONDATAASSET>(this, *FString::Printf(TEXT("Mission_%s"), *Id.ToString()));
        Mission->MissionId = Id;
        Mission->Title = NWOJson::TextField(Obj, TEXT("title"));
        Mission->Brief = NWOJson::TextField(Obj, TEXT("brief"));
        Mission->WinCondition = NWOJson::TextField(Obj, TEXT("win_condition"));
        Mission->Protagonist = NWOJson::NameField(Obj, TEXT("protagonist"));
        Mission->Location = NWOJson::NameField(Obj, TEXT("location"));
        NWOJson::NameArray(Obj, TEXT("required_previous_missions"), Mission->Prerequisites);
        NWOJson::NameArray(Obj, TEXT("supporting_npcs"), Mission->SupportingNPCs);
        NWOJson::StringArray(Obj, TEXT("failure_conditions"), Mission->FailureConditions);
        NWOJson::StringArray(Obj, TEXT("success_conditions"), Mission->SuccessConditions);
        NWOJson::NameArray(Obj, TEXT("unlocked_content"), Mission->UnlockedContent);

        const TArray<TSharedPtr<FJsonValue>>* Steps = nullptr;
        if (Obj->TryGetArrayField(TEXT("prototype_steps"), Steps))
        {
            for (const TSharedPtr<FJsonValue>& StepValue : *Steps)
            {
                const TSharedPtr<FJsonObject> Step = StepValue->AsObject();
                if (!Step.IsValid()) continue;
                FNWOMissionStep S;
                S.StepId = NWOJson::NameField(Step, TEXT("id"));
                S.Kind = NWOJson::NameField(Step, TEXT("kind"));
                S.Target = NWOJson::NameField(Step, TEXT("target"));
                S.Text = NWOJson::TextField(Step, TEXT("text"));
                Mission->PrototypeSteps.Add(S);
            }
        }

        const TArray<TSharedPtr<FJsonValue>>* Optional = nullptr;
        if (Obj->TryGetArrayField(TEXT("optional_objectives"), Optional))
        {
            for (const TSharedPtr<FJsonValue>& OptionalValue : *Optional)
            {
                const TSharedPtr<FJsonObject> O = OptionalValue->AsObject();
                if (!O.IsValid()) continue;
                FNWOMissionObjective Objective;
                Objective.ObjectiveId = NWOJson::NameField(O, TEXT("id"));
                Objective.Text = NWOJson::TextField(O, TEXT("text"));
                Objective.bOptional = true;
                O->TryGetNumberField(TEXT("points"), Objective.Points);
                Mission->OptionalObjectives.Add(Objective);
            }
        }

        const TSharedPtr<FJsonObject>* Score = nullptr;
        if (Obj->TryGetObjectField(TEXT("score_weights"), Score) && Score)
        {
            (*Score)->TryGetNumberField(TEXT("critical"), Mission->Score.Critical);
            (*Score)->TryGetNumberField(TEXT("optional"), Mission->Score.Optional);
            (*Score)->TryGetNumberField(TEXT("time"), Mission->Score.Time);
            (*Score)->TryGetNumberField(TEXT("survival"), Mission->Score.Survival);
            (*Score)->TryGetNumberField(TEXT("precision"), Mission->Score.Precision);
        }

        const TSharedPtr<FJsonObject>* Rewards = nullptr;
        if (Obj->TryGetObjectField(TEXT("rewards"), Rewards) && Rewards)
        {
            (*Rewards)->TryGetNumberField(TEXT("cash"), Mission->Rewards.Cash);
            (*Rewards)->TryGetNumberField(TEXT("reputation"), Mission->Rewards.Reputation);
        }

        const TSharedPtr<FJsonObject>* Consequences = nullptr;
        if (Obj->TryGetObjectField(TEXT("consequences"), Consequences) && Consequences)
        {
            for (const auto& Pair : (*Consequences)->Values)
            {
                Mission->Consequences.Add(FName(*Pair.Key), Pair.Value->AsNumber());
            }
        }

        Missions.Add(Id, Mission);
        MissionStates.Add(Id, Id == TEXT("M01") ? ENWOMissionState::Available : ENWOMissionState::Locked);
    }

    return Missions.Num() == 88;
}

const UNOWAYOUTMISSIONDATAASSET* UNOWAYOUTMISSIONSUBSYSTEM::GetMission(FName MissionId) const
{
    const TObjectPtr<UNOWAYOUTMISSIONDATAASSET>* Found = Missions.Find(MissionId);
    return Found ? Found->Get() : nullptr;
}

ENWOMissionState UNOWAYOUTMISSIONSUBSYSTEM::GetMissionState(FName MissionId) const
{
    const ENWOMissionState* State = MissionStates.Find(MissionId);
    return State ? *State : ENWOMissionState::Locked;
}

bool UNOWAYOUTMISSIONSUBSYSTEM::ArePrerequisitesComplete(const UNOWAYOUTMISSIONDATAASSET& Mission) const
{
    for (const FName& Required : Mission.Prerequisites)
    {
        if (GetMissionState(Required) != ENWOMissionState::Completed) return false;
    }
    return true;
}

bool UNOWAYOUTMISSIONSUBSYSTEM::SetMissionState(FName MissionId, ENWOMissionState NewState)
{
    if (!Missions.Contains(MissionId)) return false;
    MissionStates.FindOrAdd(MissionId) = NewState;
    OnMissionStateChanged.Broadcast(MissionId);
    return true;
}

TArray<FName> UNOWAYOUTMISSIONSUBSYSTEM::GetAvailableMissions() const
{
    TArray<FName> Result;
    for (const auto& Pair : Missions)
    {
        if ((GetMissionState(Pair.Key) == ENWOMissionState::Available || GetMissionState(Pair.Key) == ENWOMissionState::Discovered) && ArePrerequisitesComplete(*Pair.Value))
        {
            Result.Add(Pair.Key);
        }
    }
    Result.Sort([](const FName& A, const FName& B) { return A.LexicalLess(B); });
    return Result;
}

bool UNOWAYOUTMISSIONSUBSYSTEM::StartMission(FName MissionId)
{
    if (GetMissionState(MissionId) != ENWOMissionState::Available && GetMissionState(MissionId) != ENWOMissionState::Discovered) return false;
    const UNOWAYOUTMISSIONDATAASSET* Mission = GetMission(MissionId);
    if (!Mission || !ArePrerequisitesComplete(*Mission)) return false;
    return SetMissionState(MissionId, ENWOMissionState::Active);
}

bool UNOWAYOUTMISSIONSUBSYSTEM::CompleteMission(FName MissionId)
{
    if (GetMissionState(MissionId) != ENWOMissionState::Active) return false;
    const bool Result = SetMissionState(MissionId, ENWOMissionState::Completed);
    if (Result)
    {
        for (const auto& Pair : Missions)
        {
            if (GetMissionState(Pair.Key) == ENWOMissionState::Locked && ArePrerequisitesComplete(*Pair.Value))
            {
                const_cast<UNOWAYOUTMISSIONSUBSYSTEM*>(this)->SetMissionState(Pair.Key, ENWOMissionState::Available);
            }
        }
    }
    return Result;
}

bool UNOWAYOUTMISSIONSUBSYSTEM::FailMission(FName MissionId)
{
    return GetMissionState(MissionId) == ENWOMissionState::Active && SetMissionState(MissionId, ENWOMissionState::Failed);
}
