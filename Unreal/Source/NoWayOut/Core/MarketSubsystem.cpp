#include "MarketSubsystem.h"
#include "EconomySubsystem.h"
#include "Engine/GameInstance.h"

double UMarketSubsystem::GetPrice(FName Symbol) const { if (const double* P = Prices.Find(Symbol)) return *P; return 0.0; }
void UMarketSubsystem::SetPrice(FName Symbol, double Price) { if (Price > 0.0) Prices.Add(Symbol, Price); }
bool UMarketSubsystem::BuyShares(FName Symbol, int32 Shares)
{
    const double Price = GetPrice(Symbol); if (Price <= 0 || Shares <= 0) return false;
    const int64 Cost = static_cast<int64>(FMath::RoundToDouble(Price * Shares));
    if (UGameInstance* GI = GetGameInstance()) if (UNOWAYOUTECONOMYSUBSYSTEM* E = GI->GetSubsystem<UNOWAYOUTECONOMYSUBSYSTEM>()) if (!E->SpendCash(Cost)) return false;
    for (FStockHolding& H : Holdings) if (H.Symbol == Symbol) { const int32 Old = H.Shares; H.AveragePrice = ((H.AveragePrice * Old) + (Price * Shares)) / (Old + Shares); H.Shares += Shares; return true; }
    FStockHolding H; H.Symbol = Symbol; H.Shares = Shares; H.AveragePrice = Price; Holdings.Add(H); return true;
}
bool UMarketSubsystem::SellShares(FName Symbol, int32 Shares)
{
    const double Price = GetPrice(Symbol); if (Price <= 0 || Shares <= 0) return false;
    for (FStockHolding& H : Holdings) if (H.Symbol == Symbol && H.Shares >= Shares) { H.Shares -= Shares; if (UGameInstance* GI = GetGameInstance()) if (UNOWAYOUTECONOMYSUBSYSTEM* E = GI->GetSubsystem<UNOWAYOUTECONOMYSUBSYSTEM>()) E->AddCash(static_cast<int64>(FMath::RoundToDouble(Price * Shares))); return true; }
    return false;
}
