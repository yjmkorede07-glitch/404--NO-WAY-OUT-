using UnityEngine;
using NoWayOut.Interaction;

namespace NoWayOut.NPC
{
    public enum NPCArchetype { Civilian, Worker, Criminal, Police, Medic, Firefighter, BusinessOwner }

    public sealed class NPCWorldAgent : MonoBehaviour
    {
        [SerializeField] private NPCArchetype archetype = NPCArchetype.Civilian;
        [SerializeField] private float walkRadius = 12f;
        private Vector3 home;
        private Vector3 destination;
        private float nextDecision;
        public NPCArchetype Archetype => archetype;

        public void Configure(NPCArchetype type, string name)
        {
            archetype = type;
            var interaction = GetComponent<InteractionTarget>() ?? gameObject.AddComponent<InteractionTarget>();
            interaction.Configure(type == NPCArchetype.Police ? InteractionKind.Detain : InteractionKind.Talk, name);
        }

        private void Start() { home = transform.position; ChooseDestination(); }

        private void Update()
        {
            if (Time.time < nextDecision) return;
            Vector3 flat = destination - transform.position; flat.y = 0f;
            if (flat.magnitude < 0.5f) ChooseDestination();
            else { transform.position += flat.normalized * 1.2f * Time.deltaTime; transform.forward = Vector3.Slerp(transform.forward, flat.normalized, 5f * Time.deltaTime); }
        }

        private void ChooseDestination()
        {
            destination = home + new Vector3(Random.Range(-walkRadius, walkRadius), 0f, Random.Range(-walkRadius, walkRadius));
            nextDecision = Time.time + Random.Range(2f, 5f);
        }
    }
}
