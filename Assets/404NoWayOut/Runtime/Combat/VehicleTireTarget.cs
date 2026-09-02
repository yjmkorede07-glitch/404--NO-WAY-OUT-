using UnityEngine;

namespace NoWayOut.Combat
{
    public sealed class VehicleTireTarget : MonoBehaviour
    {
        [SerializeField] int axleIndex;
        [SerializeField] bool front;
        public bool Punctured { get; private set; }
        public int AxleIndex => axleIndex;
        public bool IsFront => front;
        public void Puncture() { Punctured = true; }
        public void Repair() { Punctured = false; }
    }
}
