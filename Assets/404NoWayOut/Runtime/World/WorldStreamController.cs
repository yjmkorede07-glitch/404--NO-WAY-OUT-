using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.World
{
    public sealed class WorldStreamController : MonoBehaviour
    {
        [SerializeField] private Transform streamSource;
        [SerializeField] private float activeRadiusKm = 4.0f;
        [SerializeField] private float hysteresisKm = 0.75f;
        [SerializeField] private List<WorldRegionRuntime> regions = new List<WorldRegionRuntime>();

        public void SetStreamSource(Transform source) => streamSource = source;
        public void Register(WorldRegionRuntime region) { if (region != null && !regions.Contains(region)) regions.Add(region); }

        private void Update()
        {
            if (streamSource == null) return;
            Vector3 p = streamSource.position;
            float keepRadius = (activeRadiusKm + hysteresisKm) * 1000f;
            float loadRadius = activeRadiusKm * 1000f;
            foreach (var region in regions)
            {
                if (region == null) continue;
                float distance = Vector3.Distance(p, region.transform.position);
                if (region.gameObject.activeSelf && distance > keepRadius) region.gameObject.SetActive(false);
                else if (!region.gameObject.activeSelf && distance <= loadRadius) region.gameObject.SetActive(true);
            }
        }
    }

    public sealed class WorldRegionRuntime : MonoBehaviour
    {
        [SerializeField] private string regionId;
        [SerializeField] private bool fullyAccessible;
        public string RegionId => regionId;
        public bool FullyAccessible => fullyAccessible;
        public void Configure(string id, bool accessible) { regionId = id; fullyAccessible = accessible; }
    }
}
