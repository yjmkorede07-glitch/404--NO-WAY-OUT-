using UnityEngine;
using NoWayOut.Interaction;

namespace NoWayOut.Missions
{
    public sealed class MissionTriggerRuntime : MonoBehaviour
    {
        [SerializeField] private string missionId = "M01";
        [SerializeField] private string title = "Mission";
        [SerializeField] private bool requirePlayer = true;
        public string MissionId => missionId;
        public string Title => title;

        private void Awake()
        {
            var target = GetComponent<InteractionTarget>() ?? gameObject.AddComponent<InteractionTarget>();
            target.Configure(InteractionKind.Mission, title, 3f);
        }

        private void OnTriggerEnter(Collider other)
        {
            if (!requirePlayer || other.CompareTag("Player")) Debug.Log($"404 mission trigger ready: {missionId} - {title}");
        }
    }
}
