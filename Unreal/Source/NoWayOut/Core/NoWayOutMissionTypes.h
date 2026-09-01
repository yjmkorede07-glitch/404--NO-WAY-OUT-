#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "NoWayOutMissionTypes.generated.h"

UENUM(BlueprintType)
enum class ENWOMissionState : uint8 { Locked, Available, Discovered, Active, Completed, Failed };

USTRUCT(BlueprintType)
struct FNWOMissionObjective {
    GENERATED_BODY()
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FName ObjectiveId;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FText Text;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) bool bOptional = false;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Points = 0;
};

USTRUCT(BlueprintType)
struct FNWOMissionRelationshipEffect {
    GENERATED_BODY()
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FName CharacterA;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FName CharacterB;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 TrustDelta = 0;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 AffectionDelta = 0;
};

USTRUCT(BlueprintType)
struct FNWOMissionScoreConfig {
    GENERATED_BODY()
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Critical = 50;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Optional = 20;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Time = 10;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Survival = 10;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) int32 Precision = 10;
};
