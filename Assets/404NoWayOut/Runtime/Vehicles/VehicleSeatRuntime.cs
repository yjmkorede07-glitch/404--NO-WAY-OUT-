using UnityEngine;
using UnityEngine.InputSystem;

namespace NoWayOut.Vehicles
{
    public sealed class VehicleSeatRuntime : MonoBehaviour
    {
        [SerializeField] private VehicleRuntime vehicle;
        [SerializeField] private Transform driverSeat;
        [SerializeField] private Transform exitPoint;
        [SerializeField] private float interactRange = 2.5f;
        private bool occupied;
        private GameObject driver;
        public bool Occupied => occupied;
        public VehicleRuntime Vehicle => vehicle;

        public void Configure(VehicleRuntime target, Transform seat, Transform exit)
        {
            vehicle = target; driverSeat = seat; exitPoint = exit;
        }

        public bool TryEnter(GameObject actor)
        {
            if (actor == null || occupied || vehicle == null) return false;
            if (Vector3.Distance(actor.transform.position, transform.position) > interactRange) return false;
            occupied = true; driver = actor;
            actor.transform.SetParent(driverSeat != null ? driverSeat : transform);
            actor.transform.localPosition = Vector3.zero;
            actor.transform.localRotation = Quaternion.identity;
            var controller = actor.GetComponent<NoWayOut.Player.ThirdPersonPlayerController>();
            if (controller != null) controller.CanMove = false;
            vehicle.SetDriver(actor);
            return true;
        }

        public bool TryExit()
        {
            if (!occupied || driver == null) return false;
            Transform destination = exitPoint != null ? exitPoint : transform;
            driver.transform.SetParent(null);
            driver.transform.position = destination.position;
            var controller = driver.GetComponent<NoWayOut.Player.ThirdPersonPlayerController>();
            if (controller != null) controller.CanMove = true;
            vehicle.ClearDriver(); driver = null; occupied = false;
            return true;
        }

        private void Update()
        {
            if (!occupied || driver == null || Keyboard.current == null) return;
            if (Keyboard.current.fKey.wasPressedThisFrame) TryExit();
        }
    }
}
