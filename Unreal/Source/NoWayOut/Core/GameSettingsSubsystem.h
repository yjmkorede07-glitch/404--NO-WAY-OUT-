#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "GameSettingsSubsystem.generated.h"

USTRUCT(BlueprintType)
struct FNoWayOutSettings
{
    GENERATED_BODY()
    UPROPERTY(BlueprintReadWrite) int32 FrameRateLimit = 60;
    UPROPERTY(BlueprintReadWrite) float MasterVolume = 1.0f;
    UPROPERTY(BlueprintReadWrite) float MusicVolume = 1.0f;
    UPROPERTY(BlueprintReadWrite) float DialogueVolume = 1.0f;
    UPROPERTY(BlueprintReadWrite) float EffectsVolume = 1.0f;
    UPROPERTY(BlueprintReadWrite) float LookSensitivity = 1.0f;
    UPROPERTY(BlueprintReadWrite) bool bSubtitles = true;
    UPROPERTY(BlueprintReadWrite) bool bAutoSave = true;
    UPROPERTY(BlueprintReadWrite) bool bVoiceChat = true;
    UPROPERTY(BlueprintReadWrite) bool bProximityVoice = false;
    UPROPERTY(BlueprintReadWrite) bool bCrossplay = true;
    UPROPERTY(BlueprintReadWrite) bool bDynamicResolution = true;
};

UCLASS()
class NOWAYOUT_API UGameSettingsSubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintPure) const FNoWayOutSettings& GetSettings() const { return Settings; }
    UFUNCTION(BlueprintCallable) void ResetToDefaults();
    UFUNCTION(BlueprintCallable) void SetFrameRateLimit(int32 Value);
    UFUNCTION(BlueprintCallable) void SetMasterVolume(float Value);
    UFUNCTION(BlueprintCallable) void SetMusicVolume(float Value);
    UFUNCTION(BlueprintCallable) void SetDialogueVolume(float Value);
    UFUNCTION(BlueprintCallable) void SetEffectsVolume(float Value);
    UFUNCTION(BlueprintCallable) void SetLookSensitivity(float Value);
    UFUNCTION(BlueprintCallable) void SetSubtitles(bool bEnabled);
    UFUNCTION(BlueprintCallable) void SetAutoSave(bool bEnabled);
    UFUNCTION(BlueprintCallable) void SetVoiceChat(bool bEnabled);
    UFUNCTION(BlueprintCallable) void SetProximityVoice(bool bEnabled);
    UFUNCTION(BlueprintCallable) void SetCrossplay(bool bEnabled);
    UFUNCTION(BlueprintCallable) void SetDynamicResolution(bool bEnabled);
private:
    UPROPERTY() FNoWayOutSettings Settings;
};
