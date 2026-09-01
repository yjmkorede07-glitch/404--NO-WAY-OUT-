#include "NoWayOutGameMode.h"
#include "NoWayOutCharacter.h"
#include "NoWayOutPlayerController.h"
#include "NoWayOutPlayerState.h"
#include "NoWayOutGameState.h"
#include "GreyboxVeyronCentral.h"

ANOWAYOUTGAMEMODE::ANOWAYOUTGAMEMODE()
{
    PlayerControllerClass = ANOWAYOUTPLAYERCONTROLLER::StaticClass();
    PlayerStateClass = ANOWAYOUTPLAYERSTATE::StaticClass();
    GameStateClass = ANOWAYOUTGAMESTATE::StaticClass();
    DefaultPawnClass = ANOWAYOUTCHARACTER::StaticClass();
}

void ANOWAYOUTGAMEMODE::StartPlay()
{
    Super::StartPlay();
    if (GetWorld())
    {
        GetWorld()->SpawnActor<ANOWAYOUTGREYBOXVEYRONCENTRAL>(ANOWAYOUTGREYBOXVEYRONCENTRAL::StaticClass(), FVector::ZeroVector, FRotator::ZeroRotator);
    }
}
