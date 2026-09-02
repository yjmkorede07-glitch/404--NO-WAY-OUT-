using UnityEngine;

namespace NoWayOut.Police
{
    public sealed class PoliceWorldRuntime : MonoBehaviour
    {
        [SerializeField, Range(0,5)] private int wantedStars;
        [SerializeField] private float decaySeconds = 45f;
        private float quietTimer;
        public int WantedStars => wantedStars;

        public void AddHeat(int stars)
        {
            wantedStars = Mathf.Clamp(wantedStars + stars, 0, 5);
            quietTimer = 0f;
        }

        public void ClearWanted() { wantedStars = 0; quietTimer = 0f; }

        private void Update()
        {
            if (wantedStars <= 0) return;
            quietTimer += Time.deltaTime;
            if (quietTimer >= decaySeconds) { wantedStars--; quietTimer = 0f; }
        }
    }
}
