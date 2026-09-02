using System;
using System.Collections.Generic;

namespace NoWayOut.Save
{
    [Serializable] public sealed class SaveGameContract
    {
        public int schemaVersion = 1;
        public string playerId;
        public string activeCharacterId;
        public string worldId;
        public string districtId;
        public string missionId;
        public List<string> completedMissions = new();
        public List<string> ownedProperties = new();
        public List<string> ownedVehicles = new();
        public long bankBalance;
        public long cashBalance;
        public string endingId;
        public long timestampUtc;
    }
}
