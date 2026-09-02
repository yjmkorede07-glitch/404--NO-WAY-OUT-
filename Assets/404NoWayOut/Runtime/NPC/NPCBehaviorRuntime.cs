using UnityEngine;

namespace NoWayOut.NPC
{
    public sealed class NPCBehaviorRuntime : MonoBehaviour
    {
        public enum BehaviorState { Idle, Travel, Work, Flee, Report, Respond, Arrest, Injured, OffDuty }
        [SerializeField] private BehaviorState state = BehaviorState.Idle;
        [SerializeField] private float travelSpeed = 1.6f;
        [SerializeField] private float decisionInterval = 3f;
        private Vector3 destination;
        private float nextDecision;
        public BehaviorState State => state;
        public void SetState(BehaviorState value) { state = value; }

        private void Start() => ChooseDestination();
        private void Update()
        {
            if (Time.time >= nextDecision && state != BehaviorState.Injured && state != BehaviorState.OffDuty) ChooseDestination();
            if (state == BehaviorState.Idle || state == BehaviorState.Work || state == BehaviorState.Report) return;
            Vector3 delta = destination - transform.position; delta.y = 0f;
            if (delta.sqrMagnitude > 0.2f) { transform.position += delta.normalized * travelSpeed * Time.deltaTime; transform.forward = Vector3.Slerp(transform.forward, delta.normalized, 5f * Time.deltaTime); }
        }
        private void ChooseDestination()
        {
            if (state == BehaviorState.Idle) state = BehaviorState.Travel;
            destination = transform.position + new Vector3(Random.Range(-10f, 10f), 0f, Random.Range(-10f, 10f));
            nextDecision = Time.time + decisionInterval + Random.Range(0f, 3f);
        }
    }
}
