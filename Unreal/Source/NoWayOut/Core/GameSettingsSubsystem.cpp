#include "GameSettingsSubsystem.h"

void UGameSettingsSubsystem::ResetToDefaults() { Settings = FNoWayOutSettings(); }
void UGameSettingsSubsystem::SetFrameRateLimit(int32 Value) { Settings.FrameRateLimit = FMath::Clamp(Value, 30, 240); }
void UGameSettingsSubsystem::SetMasterVolume(float Value) { Settings.MasterVolume = FMath::Clamp(Value, 0.f, 1.f); }
void UGameSettingsSubsystem::SetMusicVolume(float Value) { Settings.MusicVolume = FMath::Clamp(Value, 0.f, 1.f); }
void UGameSettingsSubsystem::SetDialogueVolume(float Value) { Settings.DialogueVolume = FMath::Clamp(Value, 0.f, 1.f); }
void UGameSettingsSubsystem::SetEffectsVolume(float Value) { Settings.EffectsVolume = FMath::Clamp(Value, 0.f, 1.f); }
void UGameSettingsSubsystem::SetLookSensitivity(float Value) { Settings.LookSensitivity = FMath::Clamp(Value, 0.1f, 5.f); }
void UGameSettingsSubsystem::SetSubtitles(bool bEnabled) { Settings.bSubtitles = bEnabled; }
void UGameSettingsSubsystem::SetAutoSave(bool bEnabled) { Settings.bAutoSave = bEnabled; }
void UGameSettingsSubsystem::SetVoiceChat(bool bEnabled) { Settings.bVoiceChat = bEnabled; }
void UGameSettingsSubsystem::SetProximityVoice(bool bEnabled) { Settings.bProximityVoice = bEnabled; }
void UGameSettingsSubsystem::SetCrossplay(bool bEnabled) { Settings.bCrossplay = bEnabled; }
void UGameSettingsSubsystem::SetDynamicResolution(bool bEnabled) { Settings.bDynamicResolution = bEnabled; }
