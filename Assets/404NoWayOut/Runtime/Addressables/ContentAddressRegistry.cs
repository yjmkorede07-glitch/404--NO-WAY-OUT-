using System.Collections.Generic;

namespace NoWayOut.Addressables
{
    public static class ContentAddressRegistry
    {
        public const string WorldMainland = "world/mainland";
        public const string WorldIslands = "world/islands";
        public const string Characters = "characters/protagonists";
        public const string Vehicles = "vehicles/all";
        public const string Interiors = "interiors/all";
        public const string StoryMissions = "missions/story";
        public const string OnlineMissions = "missions/online";
        public const string Cinematics = "cinematics/all";
        public const string Audio = "audio/all";
        public const string UI = "ui/all";
        public static IReadOnlyList<string> All => new[] { WorldMainland, WorldIslands, Characters, Vehicles, Interiors, StoryMissions, OnlineMissions, Cinematics, Audio, UI };
    }
}
