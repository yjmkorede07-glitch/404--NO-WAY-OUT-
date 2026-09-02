#include "PropertySubsystem.h"
#include "EconomySubsystem.h"
#include "Engine/GameInstance.h"

bool UPropertySubsystem::PurchaseProperty(const FPropertyRecord& Property)
{
    if (OwnsProperty(Property.PropertyId) || Property.PurchasePrice < 0) return false;
    if (UGameInstance* GI = GetGameInstance())
    {
        if (UNOWAYOUTECONOMYSUBSYSTEM* Economy = GI->GetSubsystem<UNOWAYOUTECONOMYSUBSYSTEM>())
        {
            if (!Economy->SpendCash(Property.PurchasePrice)) return false;
        }
    }
    FPropertyRecord NewRecord = Property; NewRecord.bOwned = true; Properties.Add(NewRecord); return true;
}

bool UPropertySubsystem::OwnsProperty(FName PropertyId) const
{
    for (const FPropertyRecord& P : Properties) if (P.PropertyId == PropertyId && P.bOwned) return true;
    return false;
}

bool UPropertySubsystem::UpgradeProperty(FName PropertyId, int64 Cost, int32 SecurityDelta, int32 StorageDelta)
{
    if (Cost < 0) return false;
    for (FPropertyRecord& P : Properties)
    {
        if (P.PropertyId == PropertyId && P.bOwned)
        {
            if (UGameInstance* GI = GetGameInstance())
                if (UNOWAYOUTECONOMYSUBSYSTEM* Economy = GI->GetSubsystem<UNOWAYOUTECONOMYSUBSYSTEM>())
                    if (!Economy->SpendCash(Cost)) return false;
            P.SecurityLevel += SecurityDelta; P.StorageCapacity += StorageDelta; return true;
        }
    }
    return false;
}
