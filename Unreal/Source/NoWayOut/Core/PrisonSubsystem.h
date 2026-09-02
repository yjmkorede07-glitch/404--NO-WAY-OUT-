#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "PrisonSubsystem.generated.h"
UENUM(BlueprintType) enum class ECustodyState : uint8 { Free, Wanted, Arrested, Transported, Booked, Incarcerated, Released, Escaped, Fugitive };
UCLASS() class NOWAYOUT_API UPrisonSubsystem : public UGameInstanceSubsystem { GENERATED_BODY() public: UFUNCTION(BlueprintCallable) bool RouteToCustody(int32 Stars); UFUNCTION(BlueprintCallable) bool AttemptEscape(); UFUNCTION(BlueprintPure) ECustodyState GetCustodyState() const { return State; } private: UPROPERTY() ECustodyState State = ECustodyState::Free; };
