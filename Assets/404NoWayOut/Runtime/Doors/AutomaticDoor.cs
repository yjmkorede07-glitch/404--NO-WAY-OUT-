using UnityEngine;

namespace NoWayOut.World
{
    public enum DoorAccessMode { Automatic, AuthorizedAutomatic, Locked, MissionControlled }

    public sealed class AutomaticDoor : MonoBehaviour
    {
        [SerializeField] private DoorAccessMode accessMode = DoorAccessMode.Automatic;
        [SerializeField] private Transform doorLeaf;
        [SerializeField] private Vector3 openOffset = new Vector3(0f, 0f, 1.2f);
        [SerializeField] private float openSpeed = 4f;
        [SerializeField] private float closeDelay = 1.25f;
        private Vector3 closedLocal;
        private Vector3 openLocal;
        private float lastOccupantTime = -999f;
        private bool open;

        private void Awake()
        {
            if (doorLeaf == null) doorLeaf = transform;
            closedLocal = doorLeaf.localPosition;
            openLocal = closedLocal + openOffset;
        }

        public void SetOpen(bool value)
        {
            if (accessMode == DoorAccessMode.Locked && value) return;
            open = value;
        }

        private void Update()
        {
            if (open && Time.time - lastOccupantTime > closeDelay) open = false;
            var target = open ? openLocal : closedLocal;
            doorLeaf.localPosition = Vector3.Lerp(doorLeaf.localPosition, target, Time.deltaTime * openSpeed);
        }

        private void OnTriggerEnter(Collider other)
        {
            if (!other.CompareTag("Player") && !other.CompareTag("Vehicle")) return;
            if (accessMode == DoorAccessMode.Locked || accessMode == DoorAccessMode.MissionControlled) return;
            lastOccupantTime = Time.time;
            open = true;
        }

        private void OnTriggerExit(Collider other)
        {
            if (other.CompareTag("Player") || other.CompareTag("Vehicle")) lastOccupantTime = Time.time;
        }
    }
}
