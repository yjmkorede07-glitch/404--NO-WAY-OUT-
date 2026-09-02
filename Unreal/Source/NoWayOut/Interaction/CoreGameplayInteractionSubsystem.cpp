#include "Interaction/CoreGameplayInteractionSubsystem.h"

bool UCoreGameplayInteractionSubsystem::CanInteract(const FInteractionRequest& Request) const {
    return !Request.ActorId.IsEmpty() && !Request.TargetId.IsEmpty() && Request.Distance <= 3.0f;
}

bool UCoreGameplayInteractionSubsystem::ExecuteInteraction(const FInteractionRequest& Request, FString& FailureReason) {
    if (!CanInteract(Request)) { FailureReason = TEXT("invalid_or_out_of_range"); return false; }
    FailureReason.Empty();
    return true;
}
