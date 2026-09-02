#include "PrisonSubsystem.h"
bool UPrisonSubsystem::RouteToCustody(int32 Stars){ if(Stars < 4) return false; State=ECustodyState::Arrested; return true; }
bool UPrisonSubsystem::AttemptEscape(){ if(State!=ECustodyState::Incarcerated) return false; State=ECustodyState::Escaped; return true; }
