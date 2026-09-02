using UnityEngine;

namespace NoWayOut.Vehicles
{
    public sealed class VehicleRuntime : MonoBehaviour
    {
        [SerializeField] private float driveSpeed = 14f;
        [SerializeField] private float turnSpeed = 65f;
        private bool occupied;
        private GameObject occupant;
        private readonly bool[] tires = new bool[4] { true, true, true, true };
        public bool Occupied => occupied;
        public GameObject Occupant => occupant;
        public void SetDriver(GameObject actor) { occupied = true; occupant = actor; var gameplay = GetComponent<VehicleGameplayRuntime>(); if (gameplay != null) gameplay.SetDriverPresent(true); }
        public void ClearDriver() { occupied = false; occupant = null; var gameplay = GetComponent<VehicleGameplayRuntime>(); if (gameplay != null) gameplay.SetDriverPresent(false); }

        public void ToggleOccupant(GameObject actor)
        {
            if (actor == null) return;
            occupied = !occupied;
            occupant = occupied ? actor : null;
            if (occupant != null) occupant.transform.SetParent(transform);
        }

        public void DamageTire(int index)
        {
            if (index < 0 || index >= tires.Length) return;
            tires[index] = false;
        }

        private void Update()
        {
            if (!occupied || occupant == null) return;
            var kb = UnityEngine.InputSystem.Keyboard.current;
            if (kb == null) return;
            float throttle = (kb.wKey.isPressed ? 1f : 0f) - (kb.sKey.isPressed ? 1f : 0f);
            float steer = (kb.dKey.isPressed ? 1f : 0f) - (kb.aKey.isPressed ? 1f : 0f);
            float traction = 1f;
            int flat = 0; foreach (bool t in tires) if (!t) flat++;
            if (flat > 0) traction = Mathf.Clamp01(1f - flat * 0.2f);
            transform.Rotate(0f, steer * turnSpeed * Time.deltaTime * Mathf.Clamp01(Mathf.Abs(throttle)), 0f);
            transform.position += transform.forward * throttle * driveSpeed * traction * Time.deltaTime;
        }
    }
}
