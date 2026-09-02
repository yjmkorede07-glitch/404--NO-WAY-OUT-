using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Multiplayer
{
    public enum NetworkSpawnKind { Player, NPC, Vehicle, MissionEntity, InteriorEntity, PoliceUnit }

    [Serializable]
    public sealed class NetworkSpawnRecord
    {
        public string networkId;
        public string ownerPlayerId;
        public NetworkSpawnKind kind;
        public string prefabKey;
        public Vector3 position;
        public Vector3 rotationEuler;
        public bool persistent;
    }

    public sealed class NetworkSpawnRuntime : MonoBehaviour
    {
        private readonly Dictionary<string, NetworkSpawnRecord> records = new Dictionary<string, NetworkSpawnRecord>();
        public IReadOnlyDictionary<string, NetworkSpawnRecord> Records => records;

        public NetworkSpawnRecord ServerSpawn(NetworkSpawnKind kind, string prefabKey, Vector3 position, Vector3 rotationEuler, string ownerPlayerId, bool persistent)
        {
            if (string.IsNullOrWhiteSpace(prefabKey)) return null;
            var record = new NetworkSpawnRecord
            {
                networkId = Guid.NewGuid().ToString("N"), ownerPlayerId = ownerPlayerId, kind = kind,
                prefabKey = prefabKey, position = position, rotationEuler = rotationEuler, persistent = persistent
            };
            records.Add(record.networkId, record);
            return record;
        }

        public bool ServerDespawn(string networkId)
        {
            return records.Remove(networkId);
        }
    }
}
