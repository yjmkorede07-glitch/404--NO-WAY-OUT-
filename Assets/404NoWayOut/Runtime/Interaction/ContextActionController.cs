using UnityEngine;
using UnityEngine.InputSystem;
using NoWayOut.Player;

namespace NoWayOut.Interaction
{
    public sealed class ContextActionController : MonoBehaviour
    {
        [SerializeField] private float scanDistance = 3.5f;
        [SerializeField] private LayerMask interactionMask = ~0;
        private InteractionTarget current;
        public InteractionTarget Current => current;

        private void Update()
        {
            var player = FindFirstObjectByType<ProtagonistRuntimeManager>()?.ActiveProtagonist;
            if (player == null) return;
            current = FindTarget(player.transform);
            var kb = Keyboard.current;
            if (current == null || kb == null) return;
            // Dedicated controls: T talk, F vehicle, G robbery, H detain, J arrest, B board/aircraft.
            if (current.Kind == InteractionKind.Talk && kb.tKey.wasPressedThisFrame) Execute("talk");
            if ((current.Kind == InteractionKind.EnterVehicle || current.Kind == InteractionKind.ExitVehicle) && kb.fKey.wasPressedThisFrame) Execute("vehicle");
            if (current.Kind == InteractionKind.Robbery && kb.gKey.wasPressedThisFrame) Execute("robbery");
            if (current.Kind == InteractionKind.Detain && kb.hKey.wasPressedThisFrame) Execute("detain");
            if (current.Kind == InteractionKind.Arrest && kb.jKey.wasPressedThisFrame) Execute("arrest");
            if ((current.Kind == InteractionKind.BoardBoat || current.Kind == InteractionKind.EnterAircraft) && kb.bKey.wasPressedThisFrame) Execute("board");
        }

        private InteractionTarget FindTarget(Transform player)
        {
            Collider[] hits = Physics.OverlapSphere(player.position, scanDistance, interactionMask, QueryTriggerInteraction.Collide);
            InteractionTarget best = null; float bestDistance = float.MaxValue;
            foreach (var hit in hits)
            {
                var target = hit.GetComponentInParent<InteractionTarget>();
                if (target == null) continue;
                float d = Vector3.Distance(player.position, target.transform.position);
                if (d <= target.Range && d < bestDistance) { best = target; bestDistance = d; }
            }
            return best;
        }

        private void Execute(string action)
        {
            Debug.Log($"404 interaction: {action} -> {current.DisplayName}");
            var vehicle = current.GetComponentInParent<NoWayOut.Vehicles.VehicleRuntime>();
            if (vehicle != null && action == "vehicle") vehicle.ToggleOccupant(gameObject);
        }
    }
}
