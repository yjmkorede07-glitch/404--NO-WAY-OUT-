#include "ProtagonistSubsystem.h"
#include "SaveSubsystem.h"

void UNOWAYOUTPROTAGONISTSUBSYSTEM::Initialize(FSubsystemCollectionBase& Collection)
{
    Super::Initialize(Collection);
    ActiveProtagonist = ENWOProtagonist::Darius;
}

bool UNOWAYOUTPROTAGONISTSUBSYSTEM::IsPlayable(ENWOProtagonist Protagonist) const
{
    return Protagonist == ENWOProtagonist::Darius || Protagonist == ENWOProtagonist::Malik || Protagonist == ENWOProtagonist::Amara;
}

bool UNOWAYOUTPROTAGONISTSUBSYSTEM::SwitchProtagonist(ENWOProtagonist NewProtagonist, bool bSaveImmediately)
{
    if (!IsPlayable(NewProtagonist) || NewProtagonist == ActiveProtagonist)
    {
        return false;
    }

    ActiveProtagonist = NewProtagonist;
    OnProtagonistChanged.Broadcast(ActiveProtagonist);

    if (bSaveImmediately)
    {
        if (UNOWAYOUTSAVESUBSYSTEM* Save = GetGameInstance()->GetSubsystem<UNOWAYOUTSAVESUBSYSTEM>())
        {
            Save->SaveStoryState();
        }
    }
    return true;
}
