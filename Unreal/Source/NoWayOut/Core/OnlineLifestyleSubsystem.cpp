#include "OnlineLifestyleSubsystem.h"
#include "HAL/PlatformTime.h"

static int64 UnixMsNow() { return FDateTime::UtcNow().ToUnixTimestamp() * 1000LL; }

bool UOnlineLifestyleSubsystem::CanChangeLifestyle() const {
    if (State.LastChangedUnixMs <= 0) return true;
    return UnixMsNow() >= State.LastChangedUnixMs + (int64)State.CooldownRealMinutes * 60LL * 1000LL;
}

bool UOnlineLifestyleSubsystem::RequestLifestyleChange(EOnlineLifestyle NewLifestyle) {
    if (!CanChangeLifestyle()) return false;
    State.Lifestyle = NewLifestyle;
    State.bPendingAcceptance = (NewLifestyle == EOnlineLifestyle::LawEnforcement);
    State.LastChangedUnixMs = UnixMsNow();
    State.bPostChoiceCinematicSeen = false;
    return true;
}

void UOnlineLifestyleSubsystem::SetLawEnforcementAcceptance(bool bAccepted) {
    if (State.Lifestyle != EOnlineLifestyle::LawEnforcement) return;
    State.bPendingAcceptance = !bAccepted;
    if (!bAccepted) State.Lifestyle = EOnlineLifestyle::Legitimate;
}

int32 UOnlineLifestyleSubsystem::GetRemainingCooldownSeconds() const {
    const int64 remain = (State.LastChangedUnixMs + (int64)State.CooldownRealMinutes * 60LL * 1000LL) - UnixMsNow();
    return FMath::Max(0, (int32)(remain / 1000LL));
}
void UOnlineLifestyleSubsystem::MarkOpeningIntroSeen() { State.bOpeningIntroSeen = true; }
void UOnlineLifestyleSubsystem::MarkPostChoiceCinematicSeen() { State.bPostChoiceCinematicSeen = true; }
