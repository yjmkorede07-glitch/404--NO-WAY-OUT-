using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Activities
{
    public enum ActivityState { Available, Active, Cooldown, Complete, Failed }
    public enum ActivityKind { Shop, Bank, Job, Robbery, Property, Construction, Marina, Aircraft, Underground }
    [Serializable] public class WorldActivity { public string id; public ActivityKind kind; public string district; public string displayName; public ActivityState state; public int reward; public bool requiresLawRole; }

    public class WorldActivityRuntime : MonoBehaviour
    {
        public List<WorldActivity> activities = new List<WorldActivity>();
        public event Action<WorldActivity> ActivityStarted;
        public event Action<WorldActivity> ActivityResolved;
        public bool TryStart(string id, bool lawRole = false)
        {
            var a = activities.Find(x => x.id == id); if (a == null || a.state != ActivityState.Available) return false;
            if (a.requiresLawRole && !lawRole) return false; a.state = ActivityState.Active; ActivityStarted?.Invoke(a); return true;
        }
        public bool Resolve(string id, bool success)
        {
            var a = activities.Find(x => x.id == id); if (a == null || a.state != ActivityState.Active) return false;
            a.state = success ? ActivityState.Complete : ActivityState.Failed; ActivityResolved?.Invoke(a); return true;
        }
    }
}
