using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Multiplayer
{
    public enum SessionRole { None, Client, Host, DedicatedServer }
    public enum SessionState { Offline, Connecting, Connected, Reconnecting, Disconnecting }

    [Serializable]
    public sealed class SessionPlayer
    {
        public string playerId;
        public string citizenId;
        public string serverId;
        public bool connected;
        public long lastSeenTick;
    }

    public sealed class MultiplayerSessionRuntime : MonoBehaviour
    {
        public const int TickRate = 30;
        public const float TickInterval = 1f / TickRate;
        private SessionState state = SessionState.Offline;
        private SessionRole role = SessionRole.None;
        private long serverTick;
        private float accumulator;
        private readonly Dictionary<string, SessionPlayer> players = new Dictionary<string, SessionPlayer>();

        public SessionState State => state;
        public SessionRole Role => role;
        public long ServerTick => serverTick;
        public IReadOnlyDictionary<string, SessionPlayer> Players => players;

        public void BeginHost() { role = SessionRole.Host; state = SessionState.Connected; }
        public void BeginDedicatedServer() { role = SessionRole.DedicatedServer; state = SessionState.Connected; }
        public void BeginClient() { role = SessionRole.Client; state = SessionState.Connecting; }
        public void MarkClientConnected() { if (role == SessionRole.Client) state = SessionState.Connected; }
        public void BeginReconnect() { if (role == SessionRole.Client) state = SessionState.Reconnecting; }
        public void CompleteReconnect() { if (role == SessionRole.Client) state = SessionState.Connected; }
        public void Disconnect() { state = SessionState.Disconnecting; }

        public bool AddOrReconnectPlayer(string playerId, string citizenId, string serverId)
        {
            if (string.IsNullOrWhiteSpace(playerId) || string.IsNullOrWhiteSpace(serverId)) return false;
            SessionPlayer player;
            if (!players.TryGetValue(playerId, out player))
            {
                player = new SessionPlayer { playerId = playerId, citizenId = citizenId, serverId = serverId };
                players.Add(playerId, player);
            }
            player.connected = true;
            player.lastSeenTick = serverTick;
            return true;
        }

        public bool MarkDisconnected(string playerId)
        {
            SessionPlayer player;
            if (!players.TryGetValue(playerId, out player)) return false;
            player.connected = false;
            player.lastSeenTick = serverTick;
            return true;
        }

        private void Update()
        {
            if (state != SessionState.Connected) return;
            accumulator += Time.unscaledDeltaTime;
            while (accumulator >= TickInterval)
            {
                accumulator -= TickInterval;
                serverTick++;
                foreach (var pair in players)
                    if (pair.Value.connected) pair.Value.lastSeenTick = serverTick;
            }
        }
    }
}
