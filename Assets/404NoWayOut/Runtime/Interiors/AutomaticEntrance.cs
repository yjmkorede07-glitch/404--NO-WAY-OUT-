using UnityEngine;
using NoWayOut.World;

namespace NoWayOut.Interiors
{
    [RequireComponent(typeof(Collider))]
    public sealed class AutomaticEntrance : MonoBehaviour
    {
        [SerializeField] private AutomaticDoor door;
        [SerializeField] private string destination = "Interior";
        public string Destination => destination;
        public void Configure(AutomaticDoor value, string target) { door = value; destination = target; }
        private void OnTriggerEnter(Collider other)
        {
            if (!other.CompareTag("Player") && !other.CompareTag("Vehicle")) return;
            if (door != null) door.SetOpen(true);
        }
    }
}
