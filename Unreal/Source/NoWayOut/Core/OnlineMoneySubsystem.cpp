#include "OnlineMoneySubsystem.h"
bool UOnlineMoneySubsystem::CanRequestTransfer(const FMoneyTransferRequest& Request) const
{
    return !Request.RecipientPlayerId.IsEmpty() && Request.Amount >= 1 && Request.Amount <= 250000 && !Request.IdempotencyKey.IsEmpty() && !ResolvedKeys.Contains(Request.IdempotencyKey) && !PendingKeys.Contains(Request.IdempotencyKey);
}
void UOnlineMoneySubsystem::MarkTransferPending(const FString& IdempotencyKey){ if(!IdempotencyKey.IsEmpty()) PendingKeys.Add(IdempotencyKey); }
void UOnlineMoneySubsystem::MarkTransferResolved(const FString& IdempotencyKey, bool bSuccess){ PendingKeys.Remove(IdempotencyKey); if(bSuccess && !IdempotencyKey.IsEmpty()) ResolvedKeys.Add(IdempotencyKey); }
