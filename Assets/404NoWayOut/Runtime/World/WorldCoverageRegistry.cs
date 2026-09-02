using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.World
{
    [Serializable]
    public sealed class WorldZone
    {
        public string id;
        public string name;
        [Range(0, 100)] public int meaningfulCoverage = 100;
        [Range(0, 100)] public int fullyAccessibleCoverage = 84;
        public string[] representativeActivities;
    }

    [CreateAssetMenu(menuName = "404/World/World Coverage Registry")]
    public sealed class WorldCoverageRegistry : ScriptableObject
    {
        [Range(0, 100)] public int targetMeaningfulCoverage = 100;
        [Range(0, 100)] public int targetFullyAccessibleCoverage = 84;
        public List<WorldZone> zones = new List<WorldZone>();

        public bool MeetsTargets(WorldZone zone) =>
            zone != null && zone.meaningfulCoverage >= targetMeaningfulCoverage &&
            zone.fullyAccessibleCoverage >= targetFullyAccessibleCoverage;
    }
}
