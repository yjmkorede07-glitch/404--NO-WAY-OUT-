#include "NPCScheduleSubsystem.h"
void UNPCScheduleSubsystem::UpdateSchedules(int32 GameHour){ (void)GameHour; }
FString UNPCScheduleSubsystem::GetPhaseForProfile(const FString& ProfileId,int32 H) const{
 if(H<6 || H>=23) return TEXT("sleep");
 if(ProfileId==TEXT("resident_worker")) return (H<9?TEXT("commute"):(H<16?TEXT("work"):(H<19?TEXT("commute"):TEXT("leisure"))));
 if(ProfileId==TEXT("criminal")) return (H<10?TEXT("scouting"):(H<16?TEXT("meeting"):TEXT("off_book_job")));
 return (H<8?TEXT("home"):(H<17?TEXT("work"):TEXT("leisure")));
}
