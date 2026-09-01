#include "NoWayOutPlayerController.h"

void ANOWAYOUTPLAYERCONTROLLER::BeginPlay()
{
    Super::BeginPlay();
    bShowMouseCursor = false;
    SetInputMode(FInputModeGameOnly());
}
