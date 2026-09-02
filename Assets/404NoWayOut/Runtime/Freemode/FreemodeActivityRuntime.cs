using UnityEngine;
using NoWayOut.Police;

namespace NoWayOut.Freemode
{
    public sealed class FreemodeActivityRuntime : MonoBehaviour
    {
        [SerializeField] private string activityId = "store_robbery";
        [SerializeField] private int heat = 1;
        [SerializeField] private bool active;
        private PoliceDirectorRuntime police;
        public bool Active => active;
        public string ActivityId => activityId;

        public void Configure(string id, int activityHeat) { activityId = id; heat = Mathf.Max(0, activityHeat); }
        public bool StartActivity()
        {
            if (active) return false;
            active = true;
            police = FindFirstObjectByType<PoliceDirectorRuntime>();
            if (police != null && heat > 0) police.RegisterCrime(heat);
            Debug.Log($"404 freemode activity started: {activityId}");
            return true;
        }
        public void ResolveActivity(bool success)
        {
            if (!active) return;
            active = false;
            Debug.Log($"404 freemode activity resolved: {activityId}, success={success}");
        }
    }
}
