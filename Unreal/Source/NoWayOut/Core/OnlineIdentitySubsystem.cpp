#include "OnlineIdentitySubsystem.h"
void UOnlineIdentitySubsystem::SetIdentity(const FOnlinePlayerIdentity& InIdentity){ Identity=InIdentity; }
void UOnlineIdentitySubsystem::ClearIdentity(){ Identity=FOnlinePlayerIdentity(); }
