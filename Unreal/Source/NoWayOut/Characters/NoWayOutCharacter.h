#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "NoWayOutMissionTypes.h"
#include "NoWayOutCharacter.generated.h"

class USpringArmComponent;
class UCameraComponent;

UCLASS()
class NOWAYOUT_API ANOWAYOUTCHARACTER : public ACharacter
{
    GENERATED_BODY()

public:
    ANOWAYOUTCHARACTER();
    virtual void SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) override;

    UFUNCTION(BlueprintCallable, Category="404|Character")
    void SetProtagonist(ENWOProtagonist InProtagonist);

    UFUNCTION(BlueprintPure, Category="404|Character")
    ENWOProtagonist GetProtagonist() const { return Protagonist; }

protected:
    virtual void BeginPlay() override;

private:
    void MoveForward(float Value);
    void MoveRight(float Value);
    void Turn(float Value);
    void LookUp(float Value);
    void SwitchToDarius();
    void SwitchToMalik();
    void SwitchToAmara();

    UPROPERTY(VisibleAnywhere, Category="404|Camera")
    TObjectPtr<USpringArmComponent> CameraBoom;

    UPROPERTY(VisibleAnywhere, Category="404|Camera")
    TObjectPtr<UCameraComponent> FollowCamera;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="404|Character", meta=(AllowPrivateAccess="true"))
    ENWOProtagonist Protagonist = ENWOProtagonist::Darius;
};
