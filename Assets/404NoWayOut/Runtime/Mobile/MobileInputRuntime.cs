using UnityEngine;
using UnityEngine.InputSystem;

namespace NoWayOut.Mobile
{
    public class MobileInputRuntime : MonoBehaviour
    {
        public Vector2 Move { get; private set; }
        public Vector2 Look { get; private set; }
        public bool SprintHeld { get; private set; }
        public bool FireHeld { get; private set; }
        public bool AimHeld { get; private set; }
        public bool JumpPressed { get; private set; }
        public bool InteractPressed { get; private set; }
        public void SetMove(Vector2 value) => Move = Vector2.ClampMagnitude(value, 1f);
        public void SetLook(Vector2 value) => Look = value;
        public void SetSprint(bool value) => SprintHeld = value;
        public void SetFire(bool value) => FireHeld = value;
        public void SetAim(bool value) => AimHeld = value;
        public void PressJump() => JumpPressed = true;
        public void PressInteract() => InteractPressed = true;
        public void ConsumeTransientButtons() { JumpPressed = false; InteractPressed = false; }
        void Update()
        {
            if (Touchscreen.current == null) return;
            // The final mobile UI writes to these setters; this keeps gameplay code independent of screen layout.
        }
    }
}
