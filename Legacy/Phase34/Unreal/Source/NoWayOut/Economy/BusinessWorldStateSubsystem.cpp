#include "BusinessWorldStateSubsystem.h"
void UBusinessWorldStateSubsystem::SetBusinessOpen(const FString& Id,bool bOpen){ auto& S=States.FindOrAdd(Id); S.BusinessId=Id; S.bOpen=bOpen; }
void UBusinessWorldStateSubsystem::SetOffBookAvailable(const FString& Id,bool B){ auto& S=States.FindOrAdd(Id); S.BusinessId=Id; S.bOffBookAvailable=B; }
void UBusinessWorldStateSubsystem::AddBusinessHeat(const FString& Id,float A){ auto& S=States.FindOrAdd(Id); S.BusinessId=Id; S.Heat=FMath::Clamp(S.Heat+A,0.f,100.f); }
