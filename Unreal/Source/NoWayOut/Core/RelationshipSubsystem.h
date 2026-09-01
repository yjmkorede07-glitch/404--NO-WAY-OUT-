#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "RelationshipSubsystem.generated.h"

USTRUCT(BlueprintType)
struct FNWORelationshipState
{
    GENERATED_BODY()
    UPROPERTY(BlueprintReadOnly) int32 Trust = 0;
    UPROPERTY(BlueprintReadOnly) int32 Affection = 0;
    UPROPERTY(BlueprintReadOnly) FName Level = TEXT("acquaintance");
};

UCLASS()
class NOWAYOUT_API UNOWAYOUTRELATIONSHIPSUBSYSTEM : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable, Category="404|Relationships") void ApplyTrustDelta(FName CharacterA, FName CharacterB, int32 Delta);
    UFUNCTION(BlueprintPure, Category="404|Relationships") FNWORelationshipState GetRelationship(FName CharacterA, FName CharacterB) const;
    UFUNCTION(BlueprintPure, Category="404|Relationships") int32 GetTrust(FName CharacterA, FName CharacterB) const;
private:
    UPROPERTY() TMap<FString, FNWORelationshipState> Relationships;
    FString MakeKey(FName A, FName B) const;
    void RefreshLevel(FNWORelationshipState& State) const;
};
