#include "NoWayOutCharacter.h"
#include "Camera/CameraComponent.h"
#include "GameFramework/SpringArmComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Components/InputComponent.h"
#include "ProtagonistSubsystem.h"

ANOWAYOUTCHARACTER::ANOWAYOUTCHARACTER()
{
    PrimaryActorTick.bCanEverTick = false;

    bUseControllerRotationYaw = false;
    GetCharacterMovement()->bOrientRotationToMovement = true;
    GetCharacterMovement()->RotationRate = FRotator(0.f, 540.f, 0.f);
    GetCharacterMovement()->MaxWalkSpeed = 520.f;

    CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));
    CameraBoom->SetupAttachment(RootComponent);
    CameraBoom->TargetArmLength = 360.f;
    CameraBoom->bUsePawnControlRotation = true;
    CameraBoom->SocketOffset = FVector(0.f, 0.f, 70.f);

    FollowCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FollowCamera"));
    FollowCamera->SetupAttachment(CameraBoom, USpringArmComponent::SocketName);
    FollowCamera->bUsePawnControlRotation = false;
}

void ANOWAYOUTCHARACTER::BeginPlay()
{
    Super::BeginPlay();
    if (UGameInstance* GI = GetGameInstance())
    {
        if (UNOWAYOUTPROTAGONISTSUBSYSTEM* Protagonists = GI->GetSubsystem<UNOWAYOUTPROTAGONISTSUBSYSTEM>())
        {
            SetProtagonist(Protagonists->GetActiveProtagonist());
        }
    }
}

void ANOWAYOUTCHARACTER::SetProtagonist(ENWOProtagonist InProtagonist)
{
    Protagonist = InProtagonist;
    // Final character meshes, outfits and animation sets are content assets to be assigned later.
}

void ANOWAYOUTCHARACTER::MoveForward(float Value)
{
    if (Controller && FMath::Abs(Value) > KINDA_SMALL_NUMBER)
    {
        const FRotator Yaw(0.f, Controller->GetControlRotation().Yaw, 0.f);
        AddMovementInput(FRotationMatrix(Yaw).GetUnitAxis(EAxis::X), Value);
    }
}

void ANOWAYOUTCHARACTER::MoveRight(float Value)
{
    if (Controller && FMath::Abs(Value) > KINDA_SMALL_NUMBER)
    {
        const FRotator Yaw(0.f, Controller->GetControlRotation().Yaw, 0.f);
        AddMovementInput(FRotationMatrix(Yaw).GetUnitAxis(EAxis::Y), Value);
    }
}

void ANOWAYOUTCHARACTER::Turn(float Value) { AddControllerYawInput(Value); }
void ANOWAYOUTCHARACTER::LookUp(float Value) { AddControllerPitchInput(Value); }

void ANOWAYOUTCHARACTER::SwitchToDarius()
{
    if (UGameInstance* GI = GetGameInstance()) if (auto* S = GI->GetSubsystem<UNOWAYOUTPROTAGONISTSUBSYSTEM>()) S->SwitchProtagonist(ENWOProtagonist::Darius);
}
void ANOWAYOUTCHARACTER::SwitchToMalik()
{
    if (UGameInstance* GI = GetGameInstance()) if (auto* S = GI->GetSubsystem<UNOWAYOUTPROTAGONISTSUBSYSTEM>()) S->SwitchProtagonist(ENWOProtagonist::Malik);
}
void ANOWAYOUTCHARACTER::SwitchToAmara()
{
    if (UGameInstance* GI = GetGameInstance()) if (auto* S = GI->GetSubsystem<UNOWAYOUTPROTAGONISTSUBSYSTEM>()) S->SwitchProtagonist(ENWOProtagonist::Amara);
}

void ANOWAYOUTCHARACTER::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);
    PlayerInputComponent->BindAxis(TEXT("MoveForward"), this, &ANOWAYOUTCHARACTER::MoveForward);
    PlayerInputComponent->BindAxis(TEXT("MoveRight"), this, &ANOWAYOUTCHARACTER::MoveRight);
    PlayerInputComponent->BindAxis(TEXT("Turn"), this, &ANOWAYOUTCHARACTER::Turn);
    PlayerInputComponent->BindAxis(TEXT("LookUp"), this, &ANOWAYOUTCHARACTER::LookUp);
    PlayerInputComponent->BindAction(TEXT("Protagonist_Darius"), IE_Pressed, this, &ANOWAYOUTCHARACTER::SwitchToDarius);
    PlayerInputComponent->BindAction(TEXT("Protagonist_Malik"), IE_Pressed, this, &ANOWAYOUTCHARACTER::SwitchToMalik);
    PlayerInputComponent->BindAction(TEXT("Protagonist_Amara"), IE_Pressed, this, &ANOWAYOUTCHARACTER::SwitchToAmara);
}
