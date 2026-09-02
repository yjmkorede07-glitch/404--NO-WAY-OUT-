using UnityEngine;

namespace NoWayOut.Police
{
    public sealed class PoliceDirectorRuntime : MonoBehaviour
    {
        [SerializeField] private PoliceWorldRuntime wantedSystem;
        [SerializeField] private float responseRadius = 55f;
        [SerializeField] private float responseInterval = 5f;
        private float timer;
        public int CurrentStars => wantedSystem != null ? wantedSystem.WantedStars : 0;
        public void RegisterCrime(int heat) { if (wantedSystem != null) wantedSystem.AddHeat(Mathf.Max(1, heat)); }

        private void Update()
        {
            timer += Time.deltaTime;
            if (timer < responseInterval || CurrentStars <= 0) return;
            timer = 0f;
            int count = Mathf.Clamp(CurrentStars + 1, 1, 5);
            Debug.Log($"404 police response: {count} unit(s) dispatched within {responseRadius:0}m.");
        }
    }
}
