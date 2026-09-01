#include "RelationshipSubsystem.h"

FString UNOWAYOUTRELATIONSHIPSUBSYSTEM::MakeKey(FName A, FName B) const
{
    FString Left = A.ToString(), Right = B.ToString();
    if (Left > Right) Swap(Left, Right);
    return Left + TEXT("|") + Right;
}

void UNOWAYOUTRELATIONSHIPSUBSYSTEM::RefreshLevel(FNWORelationshipState& State) const
{
    if (State.Trust >= 75) State.Level = TEXT("close");
    else if (State.Trust >= 45) State.Level = TEXT("trusted");
    else if (State.Trust >= 10) State.Level = TEXT("acquaintance");
    else if (State.Trust <= -50) State.Level = TEXT("rival");
    else if (State.Trust < 0) State.Level = TEXT("strained");
    else State.Level = TEXT("stranger");
}

void UNOWAYOUTRELATIONSHIPSUBSYSTEM::ApplyTrustDelta(FName CharacterA, FName CharacterB, int32 Delta)
{
    FNWORelationshipState& State = Relationships.FindOrAdd(MakeKey(CharacterA, CharacterB));
    State.Trust = FMath::Clamp(State.Trust + Delta, -100, 100);
    RefreshLevel(State);
}

FNWORelationshipState UNOWAYOUTRELATIONSHIPSUBSYSTEM::GetRelationship(FName CharacterA, FName CharacterB) const
{
    const FNWORelationshipState* Found = Relationships.Find(MakeKey(CharacterA, CharacterB));
    return Found ? *Found : FNWORelationshipState();
}

int32 UNOWAYOUTRELATIONSHIPSUBSYSTEM::GetTrust(FName CharacterA, FName CharacterB) const
{
    return GetRelationship(CharacterA, CharacterB).Trust;
}
