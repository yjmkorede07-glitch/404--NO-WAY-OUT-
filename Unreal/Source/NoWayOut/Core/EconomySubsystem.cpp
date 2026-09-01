#include "EconomySubsystem.h"

void UNOWAYOUTECONOMYSUBSYSTEM::AddCash(int64 Amount) { Cash = FMath::Max<int64>(0, Cash + Amount); }
bool UNOWAYOUTECONOMYSUBSYSTEM::SpendCash(int64 Amount)
{
    if (Amount < 0 || Cash < Amount) return false;
    Cash -= Amount; return true;
}
void UNOWAYOUTECONOMYSUBSYSTEM::AddReputation(int32 Amount) { Reputation = FMath::Clamp(Reputation + Amount, -1000, 1000); }
