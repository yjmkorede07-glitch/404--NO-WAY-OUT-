using System;
using System.Collections.Generic;

namespace NoWayOut.Backend
{
    public static class BackendServiceContract
    {
        public const int ContractVersion = 1;
        public const string Auth = "/v1/auth";
        public const string Profiles = "/v1/profiles";
        public const string Characters = "/v1/characters";
        public const string WorldState = "/v1/world-state";
        public const string Economy = "/v1/economy";
        public const string Properties = "/v1/properties";
        public const string Missions = "/v1/missions";
        public const string Force = "/v1/force";
        public const string Moderation = "/v1/moderation";
        public const string Telemetry = "/v1/telemetry";
        public const string Reconnect = "/v1/reconnect";

        [Serializable] public sealed class SaveEnvelope
        {
            public int version = ContractVersion;
            public string accountId;
            public string characterId;
            public long serverUnixMs;
            public Dictionary<string, string> state = new Dictionary<string, string>();
        }
    }
}
