#include "NoWayOutPlayerState.h"
#include "Net/UnrealNetwork.h"

void ANOWAYOUTPLAYERSTATE::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(ANOWAYOUTPLAYERSTATE, ActiveProtagonist);
}

void ANOWAYOUTPLAYERSTATE::SetActiveProtagonist(ENWOProtagonist NewProtagonist)
{
    if (HasAuthority()) ActiveProtagonist = NewProtagonist;
}
