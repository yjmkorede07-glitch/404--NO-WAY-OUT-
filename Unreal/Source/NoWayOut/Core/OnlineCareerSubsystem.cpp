#include "OnlineCareerSubsystem.h"

bool UOnlineCareerSubsystem::CreateCharacter(const FString& PlayerId, const FString& InDisplayName)
{
    if (PlayerId.IsEmpty() || InDisplayName.IsEmpty()) return false;
    Profile = FOnlineCareerProfile();
    Profile.PlayerId = PlayerId;
    Profile.StartingGrant = 10000000;
    Profile.bCharacterCreated = true;
    DisplayName = InDisplayName;
    return true;
}

void UOnlineCareerSubsystem::ChooseWorld(const FString& WorldId)
{
    if (Profile.bCharacterCreated) Profile.WorldId = WorldId;
}

void UOnlineCareerSubsystem::ChooseLegitimateLife()
{
    Profile.LifePath = EOnlineLifePath::Legitimate;
    Profile.CriminalSpecialization = ECriminalSpecialization::None;
    Profile.LawEnforcementStatus = ELawEnforcementStatus::NotApplied;
}

void UOnlineCareerSubsystem::ChooseCriminalLife(ECriminalSpecialization Specialization)
{
    Profile.LifePath = EOnlineLifePath::Criminal;
    Profile.CriminalSpecialization = Specialization;
    Profile.LawEnforcementStatus = ELawEnforcementStatus::NotApplied;
}

void UOnlineCareerSubsystem::ApplyForLawEnforcement()
{
    Profile.LifePath = EOnlineLifePath::LawEnforcement;
    Profile.CriminalSpecialization = ECriminalSpecialization::None;
    Profile.LawEnforcementStatus = ELawEnforcementStatus::PendingReview;
}

void UOnlineCareerSubsystem::SetLawEnforcementDecision(bool bAccepted)
{
    if (Profile.LifePath != EOnlineLifePath::LawEnforcement) return;
    Profile.LawEnforcementStatus = bAccepted ? ELawEnforcementStatus::Accepted : ELawEnforcementStatus::Rejected;
    if (!bAccepted) Profile.LifePath = EOnlineLifePath::Legitimate;
}

void UOnlineCareerSubsystem::SetRecommendedDistrict(const FString& DistrictId)
{
    if (!DistrictId.IsEmpty()) Profile.HomeDistrict = DistrictId;
}

void UOnlineCareerSubsystem::CompleteHousePurchase() { Profile.bHousePurchased = true; }
void UOnlineCareerSubsystem::CompleteCitizenId() { Profile.bIdObtained = true; }
void UOnlineCareerSubsystem::CompleteStarterVehiclePurchase() { Profile.bStarterVehicleOwned = true; }

bool UOnlineCareerSubsystem::CanStartOnboardingMission() const
{
    return Profile.bCharacterCreated && !Profile.WorldId.IsEmpty() && !Profile.HomeDistrict.IsEmpty() &&
           (Profile.LifePath != EOnlineLifePath::LawEnforcement || Profile.LawEnforcementStatus == ELawEnforcementStatus::Accepted);
}

bool UOnlineCareerSubsystem::IsOnboardingComplete() const
{
    return Profile.bCharacterCreated && !Profile.WorldId.IsEmpty() && !Profile.HomeDistrict.IsEmpty() &&
           Profile.bHousePurchased && Profile.bIdObtained && Profile.bStarterVehicleOwned &&
           (Profile.LifePath != EOnlineLifePath::LawEnforcement || Profile.LawEnforcementStatus == ELawEnforcementStatus::Accepted);
}

void UOnlineCareerSubsystem::ResetCareer()
{
    Profile = FOnlineCareerProfile();
    DisplayName.Empty();
}
