using System;
using System.Collections.Generic;
using UnityEngine;
namespace NoWayOut.Construction
{
    public enum ConstructionStage { Survey, Foundation, Frame, Exterior, Interior, Landscaping, Finished }
    [Serializable] public class ConstructionProject { public string id; public string propertyId; public ConstructionStage stage; public float progress; public bool active; }
    public class ConstructionRuntime : MonoBehaviour
    {
        public List<ConstructionProject> projects=new List<ConstructionProject>();
        public bool StartProject(string id,string propertyId) { if(projects.Exists(x=>x.id==id)) return false; projects.Add(new ConstructionProject{id=id,propertyId=propertyId,stage=ConstructionStage.Survey,active=true}); return true; }
        public void Advance(string id,float amount) { var p=projects.Find(x=>x.id==id); if(p==null||!p.active)return; p.progress=Mathf.Clamp01(p.progress+amount); p.stage=(ConstructionStage)Mathf.Min(6,Mathf.FloorToInt(p.progress*7f)); if(p.progress>=1f){p.stage=ConstructionStage.Finished;p.active=false;} }
    }
}
