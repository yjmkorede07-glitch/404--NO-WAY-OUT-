using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Properties
{
    [Serializable] public class PropertySlot { public string id; public string district; public string type; public int price; public bool owned; public bool allowsDock; public bool allowsHelipad; public bool allowsHangar; public bool allowsGarage; }
    public class PropertyRuntime : MonoBehaviour
    {
        public List<PropertySlot> properties = new List<PropertySlot>();
        public bool Purchase(string id) { var p = properties.Find(x=>x.id==id); if(p==null || p.owned) return false; p.owned=true; return true; }
        public bool CanBuildDock(string id) { var p=properties.Find(x=>x.id==id); return p!=null && p.owned && p.allowsDock; }
        public bool CanBuildHelipad(string id) { var p=properties.Find(x=>x.id==id); return p!=null && p.owned && p.allowsHelipad; }
        public bool CanBuildHangar(string id) { var p=properties.Find(x=>x.id==id); return p!=null && p.owned && p.allowsHangar; }
    }
}
