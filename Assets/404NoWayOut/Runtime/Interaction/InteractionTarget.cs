using UnityEngine;

namespace NoWayOut.Interaction
{
    public enum InteractionKind { Talk, EnterVehicle, ExitVehicle, Robbery, Arrest, Detain, Purchase, Mission, BoardBoat, EnterAircraft, UseService }

    public sealed class InteractionTarget : MonoBehaviour
    {
        [SerializeField] private InteractionKind kind = InteractionKind.Talk;
        [SerializeField] private string displayName = "Person";
        [SerializeField] private float range = 2.2f;
        public InteractionKind Kind => kind;
        public string DisplayName => displayName;
        public float Range => range;
        public void Configure(InteractionKind value, string name, float interactionRange = 2.2f) { kind = value; displayName = name; range = interactionRange; }
    }
}
