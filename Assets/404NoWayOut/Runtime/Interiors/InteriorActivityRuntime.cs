using UnityEngine;

namespace NoWayOut.Interiors
{
    public enum InteriorActivity { None, Talk, Work, Shop, Rob, Rest, StoreVehicle, RepairVehicle, StartMission, Service, RestrictedArea }

    public sealed class InteriorActivityRuntime : MonoBehaviour
    {
        [SerializeField] private InteriorActivity activity = InteriorActivity.None;
        [SerializeField] private string activityId = "interior_activity";
        [SerializeField] private bool requiresAuthorization;
        public InteriorActivity Activity => activity;
        public string ActivityId => activityId;
        public bool RequiresAuthorization => requiresAuthorization;
        public bool TryPerform(bool authorized)
        {
            if (requiresAuthorization && !authorized) return false;
            Debug.Log($"404 interior activity: {activityId} / {activity}");
            return true;
        }
    }
}
