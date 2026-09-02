using UnityEngine;

namespace NoWayOut.Interiors
{
    public sealed class AutomaticDoorController : MonoBehaviour
    {
        [SerializeField] private Transform panel;
        [SerializeField] private Vector3 openLocalOffset = new Vector3(0f, 0f, 1.2f);
        [SerializeField] private float speed = 4f;
        [SerializeField] private float activationRange = 2.5f;
        [SerializeField] private bool requiresAuthorization;
        private Vector3 closedPosition;
        private bool open;
        private void Awake() { if (panel == null) panel = transform; closedPosition = panel.localPosition; }
        public void SetOpen(bool value) { open = value; }
        private void Update()
        {
            GameObject player = GameObject.FindGameObjectWithTag("Player");
            if (player != null && Vector3.Distance(player.transform.position, transform.position) <= activationRange && !requiresAuthorization) open = true;
            Vector3 target = open ? closedPosition + openLocalOffset : closedPosition;
            panel.localPosition = Vector3.MoveTowards(panel.localPosition, target, speed * Time.deltaTime);
        }
    }
}
