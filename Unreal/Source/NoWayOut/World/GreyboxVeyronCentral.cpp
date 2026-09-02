#include "GreyboxVeyronCentral.h"
#include "Components/StaticMeshComponent.h"
#include "Components/SceneComponent.h"
#include "UObject/ConstructorHelpers.h"

ANOWAYOUTGREYBOXVEYRONCENTRAL::ANOWAYOUTGREYBOXVEYRONCENTRAL()
{
    PrimaryActorTick.bCanEverTick = false;
    SetReplicates(false);
    USceneComponent* SceneRoot = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = SceneRoot;
}

void ANOWAYOUTGREYBOXVEYRONCENTRAL::BeginPlay()
{
    Super::BeginPlay();
    AddBlock(FVector(0,0,-50), FVector(40,40,0.5f), FLinearColor::White); // ground
    AddBlock(FVector(0,900,250), FVector(8,1,5), FLinearColor::White); // central tower
    AddBlock(FVector(-900,0,160), FVector(1,10,3), FLinearColor::White); // west block
    AddBlock(FVector(900,0,160), FVector(1,10,3), FLinearColor::White); // east block
    AddBlock(FVector(0,-900,160), FVector(10,1,3), FLinearColor::White); // south block
    AddBlock(FVector(0,0,10), FVector(3,3,0.2f), FLinearColor::White); // plaza
}

void ANOWAYOUTGREYBOXVEYRONCENTRAL::AddBlock(const FVector& Location, const FVector& Scale, const FLinearColor& Tint)
{
    UStaticMeshComponent* Mesh = NewObject<UStaticMeshComponent>(this);
    Mesh->SetupAttachment(GetRootComponent());
    Mesh->RegisterComponent();
    UStaticMesh* Cube = LoadObject<UStaticMesh>(nullptr, TEXT("/Engine/BasicShapes/Cube.Cube"));
    if (Cube) Mesh->SetStaticMesh(Cube);
    Mesh->SetWorldLocation(GetActorLocation() + Location);
    Mesh->SetWorldScale3D(Scale);
    Mesh->SetMobility(EComponentMobility::Static);
}
