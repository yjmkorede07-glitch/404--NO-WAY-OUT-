#include "NoWayOutGameState.h"
#include "Net/UnrealNetwork.h"

void ANOWAYOUTGAMESTATE::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(ANOWAYOUTGAMESTATE, ActiveMissionId);
    DOREPLIFETIME(ANOWAYOUTGAMESTATE, ActiveProtagonist);
    DOREPLIFETIME(ANOWAYOUTGAMESTATE, EndingId);
    DOREPLIFETIME(ANOWAYOUTGAMESTATE, bFreeRoamUnlocked);
}
