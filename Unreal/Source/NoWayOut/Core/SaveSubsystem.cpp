#include "SaveSubsystem.h"
#include "Kismet/GameplayStatics.h"

void UNOWAYOUTSAVESUBSYSTEM::SetEnding(const FString& InEndingId)
{
    EndingId = InEndingId;
    bFreeRoamUnlocked = true;
}

bool UNOWAYOUTSAVESUBSYSTEM::SaveStoryState(const FString& SlotName)
{
    UNOWAYOUTSAVEGAME* Save = Cast<UNOWAYOUTSAVEGAME>(UGameplayStatics::CreateSaveGameObject(UNOWAYOUTSAVEGAME::StaticClass()));
    if (!Save) return false;
    Save->EndingId = EndingId;
    Save->bFreeRoamUnlocked = bFreeRoamUnlocked;
    return UGameplayStatics::SaveGameToSlot(Save, SlotName, 0);
}

bool UNOWAYOUTSAVESUBSYSTEM::LoadStoryState(const FString& SlotName)
{
    if (!UGameplayStatics::DoesSaveGameExist(SlotName, 0)) return false;
    UNOWAYOUTSAVEGAME* Save = Cast<UNOWAYOUTSAVEGAME>(UGameplayStatics::LoadGameFromSlot(SlotName, 0));
    if (!Save) return false;
    EndingId = Save->EndingId;
    bFreeRoamUnlocked = Save->bFreeRoamUnlocked;
    return true;
}
