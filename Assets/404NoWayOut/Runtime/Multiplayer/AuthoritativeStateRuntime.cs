using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Multiplayer
{
    [Serializable]
    public struct NetworkTransformState
    {
        public Vector3 position;
        public Vector3 rotationEuler;
        public long tick;
    }

    [Serializable]
    public sealed class AuthoritativePlayerState
    {
        public string playerId;
        public string citizenId;
        public NetworkTransformState transform;
        public int health;
        public int armor;
        public int wantedStars;
        public int balanceVcr;
        public bool inCustody;
    }

    public sealed class AuthoritativeStateRuntime : MonoBehaviour
    {
        private readonly Dictionary<string, AuthoritativePlayerState> states = new Dictionary<string, AuthoritativePlayerState>();
        public IReadOnlyDictionary<string, AuthoritativePlayerState> States => states;

        public bool Register(string playerId, string citizenId, int initialHealth, int initialArmor)
        {
            if (string.IsNullOrWhiteSpace(playerId) || states.ContainsKey(playerId)) return false;
            states.Add(playerId, new AuthoritativePlayerState { playerId = playerId, citizenId = citizenId, health = initialHealth, armor = initialArmor });
            return true;
        }

        public bool ApplyServerTransform(string playerId, Vector3 position, Vector3 rotationEuler, long tick)
        {
            AuthoritativePlayerState state;
            if (!states.TryGetValue(playerId, out state)) return false;
            if (tick < state.transform.tick) return false;
            state.transform = new NetworkTransformState { position = position, rotationEuler = rotationEuler, tick = tick };
            return true;
        }

        public bool ApplyServerEconomy(string playerId, int balanceVcr)
        {
            AuthoritativePlayerState state;
            if (!states.TryGetValue(playerId, out state) || balanceVcr < 0) return false;
            state.balanceVcr = balanceVcr;
            return true;
        }

        public bool ApplyServerWanted(string playerId, int wantedStars)
        {
            AuthoritativePlayerState state;
            if (!states.TryGetValue(playerId, out state) || wantedStars < 0 || wantedStars > 5) return false;
            state.wantedStars = wantedStars;
            return true;
        }
    }
}
