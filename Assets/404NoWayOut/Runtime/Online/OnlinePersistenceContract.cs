using System;
using UnityEngine;

namespace NoWayOut.Online
{
    [Serializable]
    public sealed class OnlineSaveEnvelope
    {
        public int schemaVersion = 1;
        public string accountId;
        public string serverId;
        public string savedUtc;
        public string stateJson;
        public string checksum;
    }

    public static class OnlinePersistenceContract
    {
        public const int SchemaVersion = 1;
        public const string ServerAuthority = "server_authoritative";
        public const string ClientRule = "clients_never_authoritative_for_money_property_force_or_custody";

        public static OnlineSaveEnvelope CreateEnvelope(string accountId, string serverId, string stateJson, string checksum)
        {
            return new OnlineSaveEnvelope { schemaVersion = SchemaVersion, accountId = accountId, serverId = serverId, savedUtc = DateTime.UtcNow.ToString("O"), stateJson = stateJson, checksum = checksum };
        }
    }
}
