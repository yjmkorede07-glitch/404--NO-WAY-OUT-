using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Multiplayer
{
    [Serializable]
    public sealed class ReconnectCheckpoint
    {
        public string playerId;
        public string serverId;
        public string districtId;
        public string interiorId;
        public Vector3 position;
        public long serverTick;
        public string missionId;
        public int balanceVcr;
        public string savedUtc;
    }

    public sealed class ReconnectStateRuntime : MonoBehaviour
    {
        private readonly Dictionary<string, ReconnectCheckpoint> checkpoints = new Dictionary<string, ReconnectCheckpoint>();
        public IReadOnlyDictionary<string, ReconnectCheckpoint> Checkpoints => checkpoints;

        public void Save(ReconnectCheckpoint checkpoint)
        {
            if (checkpoint == null || string.IsNullOrWhiteSpace(checkpoint.playerId)) return;
            checkpoint.savedUtc = DateTime.UtcNow.ToString("O");
            checkpoints[checkpoint.playerId] = checkpoint;
        }

        public bool TryRestore(string playerId, out ReconnectCheckpoint checkpoint)
        {
            return checkpoints.TryGetValue(playerId, out checkpoint);
        }
    }
}
