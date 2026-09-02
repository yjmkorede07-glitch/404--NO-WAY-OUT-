using System;
using UnityEngine;

namespace NoWayOut.World
{
    public enum WorldRegionType { DenseCity, UrbanMarket, Suburban, Industrial, Coast, Airport, Port, Highway, Rural, Lakes, Mountain, AlpineSnow, Island }

    [Serializable]
    public sealed class WorldRegionDefinition
    {
        public string id;
        public string displayName;
        public WorldRegionType type;
        public Vector2 centerKm;
        public Vector2 sizeKm = new Vector2(1f, 1f);
        [Range(0,100)] public int meaningfulCoverage = 100;
        [Range(0,100)] public int fullyAccessibleCoverage = 84;
        public bool purchasableLand;
        public bool majorIsland;
        public string[] activities;
    }

    [Serializable]
    public sealed class WorldLayoutDefinition
    {
        public Vector2 mainlandSizeKm = new Vector2(16f, 12f);
        public int meaningfulCoverageTarget = 100;
        public int fullyAccessibleTarget = 84;
        public WorldRegionDefinition[] regions;
    }
}
