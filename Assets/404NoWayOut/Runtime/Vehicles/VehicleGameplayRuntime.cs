using UnityEngine;
using UnityEngine.InputSystem;

namespace NoWayOut.Vehicles
{
    public enum TireState { Intact, Punctured, Deflated, Destroyed }

    public sealed class VehicleGameplayRuntime : MonoBehaviour
    {
        [SerializeField] private float maxSpeed = 18f;
        [SerializeField] private float reverseSpeed = 8f;
        [SerializeField] private float turnRate = 55f;
        [SerializeField] private float braking = 0.9f;
        private readonly TireState[] tires = new TireState[4];
        private float speed;
        private bool driverPresent;
        public float Speed => speed;
        public TireState GetTire(int index) => index >= 0 && index < 4 ? tires[index] : TireState.Intact;

        private void Awake() { for (int i = 0; i < tires.Length; i++) tires[i] = TireState.Intact; }

        public void SetDriverPresent(bool value) => driverPresent = value;

        public void DamageTire(int index, TireState state = TireState.Punctured)
        {
            if (index < 0 || index >= 4) return;
            tires[index] = state;
        }

        public void RepairTire(int index)
        {
            if (index < 0 || index >= 4) return;
            tires[index] = TireState.Intact;
        }

        private void Update()
        {
            if (!driverPresent) { speed = Mathf.MoveTowards(speed, 0f, braking * 12f * Time.deltaTime); return; }
            var kb = Keyboard.current;
            if (kb == null) return;
            float throttle = kb.wKey.isPressed ? 1f : kb.sKey.isPressed ? -1f : 0f;
            float steer = (kb.dKey.isPressed ? 1f : 0f) - (kb.aKey.isPressed ? 1f : 0f);
            int impaired = 0; foreach (var tire in tires) if (tire != TireState.Intact) impaired++;
            float traction = Mathf.Clamp01(1f - impaired * 0.18f);
            float target = throttle >= 0 ? throttle * maxSpeed : throttle * reverseSpeed;
            speed = Mathf.MoveTowards(speed, target * traction, 10f * Time.deltaTime);
            transform.Rotate(0f, steer * turnRate * Mathf.Clamp01(Mathf.Abs(speed) / maxSpeed) * Time.deltaTime, 0f);
            transform.position += transform.forward * speed * Time.deltaTime;
        }
    }
}
