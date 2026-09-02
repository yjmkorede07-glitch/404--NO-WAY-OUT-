using UnityEngine;
using UnityEngine.InputSystem;

namespace NoWayOut.Inputs
{
    public sealed class SeparateActionInput : MonoBehaviour
    {
        public Key talk = Key.T;
        public Key enterExitVehicle = Key.F;
        public Key robbery = Key.G;
        public Key detain = Key.H;
        public Key arrest = Key.J;
        public Key reload = Key.R;

        public bool Pressed(Key key) => Keyboard.current != null && Keyboard.current[key].wasPressedThisFrame;
        public bool TalkPressed() => Pressed(talk);
        public bool EnterExitVehiclePressed() => Pressed(enterExitVehicle);
        public bool RobberyPressed() => Pressed(robbery);
        public bool DetainPressed() => Pressed(detain);
        public bool ArrestPressed() => Pressed(arrest);
        public bool ReloadPressed() => Pressed(reload);
    }
}
