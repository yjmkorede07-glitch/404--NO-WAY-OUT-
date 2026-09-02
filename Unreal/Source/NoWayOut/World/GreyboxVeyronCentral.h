#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "GreyboxVeyronCentral.generated.h"

UCLASS()
class NOWAYOUT_API ANOWAYOUTGREYBOXVEYRONCENTRAL : public AActor
{
    GENERATED_BODY()
public:
    ANOWAYOUTGREYBOXVEYRONCENTRAL();
    virtual void BeginPlay() override;

private:
    void AddBlock(const FVector& Location, const FVector& Scale, const FLinearColor& Tint);
};
