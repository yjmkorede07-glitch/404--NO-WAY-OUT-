using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Maritime
{
    public enum VehicleClass { CivilianBoat, Speedboat, UtilityBoat, PatrolBoat, Helicopter, UtilityAircraft, PrivateAircraft, HighPerformanceAircraft }
    [Serializable] public class OwnedCraft { public string id; public string displayName; public VehicleClass vehicleClass; public bool owned; public string storage; }
    public class MaritimeAircraftRuntime : MonoBehaviour
    {
        public List<OwnedCraft> craft = new List<OwnedCraft>();
        public bool Purchase(string id) { var c=craft.Find(x=>x.id==id); if(c==null || c.owned) return false; c.owned=true; return true; }
        public bool Store(string id,string location) { var c=craft.Find(x=>x.id==id); if(c==null || !c.owned) return false; c.storage=location; return true; }
    }
}
