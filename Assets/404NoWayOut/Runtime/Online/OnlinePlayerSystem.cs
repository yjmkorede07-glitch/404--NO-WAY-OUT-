using System;
using System.Collections.Generic;
using UnityEngine;
using NoWayOut.Online;

namespace NoWayOut.OnlinePlayer
{
    public enum PlayerPresence { Offline, Connecting, Online, Reconnecting, Disconnected, Banned }
    public enum CharacterSlotState { Empty, Active, Archived }

    [Serializable]
    public sealed class OnlinePlayerProfile
    {
        public string playerId;
        public string displayName;
        public PlayerPresence presence;
        public string activeCharacterId;
        public int characterSlots;
        public int totalPlayMinutes;
        public int reputation;
        public string lastSeenUtc;
    }

    [Serializable]
    public sealed class OnlineCharacterSlot
    {
        public string characterId;
        public string playerId;
        public CharacterSlotState state;
        public string characterName;
        public string citizenId;
        public WorldServer server;
        public Lifestyle lifestyle;
        public string createdUtc;
        public string lastPlayedUtc;
    }

    public sealed class OnlinePlayerSystem : MonoBehaviour
    {
        public const int DefaultCharacterSlots = 3;
        private readonly Dictionary<string, OnlinePlayerProfile> players = new Dictionary<string, OnlinePlayerProfile>();
        private readonly Dictionary<string, OnlineCharacterSlot> characters = new Dictionary<string, OnlineCharacterSlot>();

        public IReadOnlyDictionary<string, OnlinePlayerProfile> Players => players;
        public IReadOnlyDictionary<string, OnlineCharacterSlot> Characters => characters;

        public OnlinePlayerProfile RegisterPlayer(string playerId, string displayName)
        {
            if (string.IsNullOrWhiteSpace(playerId) || players.ContainsKey(playerId)) return null;
            var profile = new OnlinePlayerProfile
            {
                playerId = playerId,
                displayName = string.IsNullOrWhiteSpace(displayName) ? "Player" : displayName,
                presence = PlayerPresence.Connecting,
                characterSlots = DefaultCharacterSlots,
                totalPlayMinutes = 0,
                reputation = 0,
                lastSeenUtc = DateTime.UtcNow.ToString("O")
            };
            players.Add(playerId, profile);
            return profile;
        }

        public bool SetPresence(string playerId, PlayerPresence presence)
        {
            OnlinePlayerProfile profile;
            if (!players.TryGetValue(playerId, out profile) || presence == PlayerPresence.Banned) return false;
            profile.presence = presence;
            profile.lastSeenUtc = DateTime.UtcNow.ToString("O");
            return true;
        }

        public OnlineCharacterSlot CreateCharacterSlot(string playerId, string characterName, WorldServer server, Lifestyle lifestyle)
        {
            OnlinePlayerProfile profile;
            if (!players.TryGetValue(playerId, out profile) || lifestyle == Lifestyle.LawEnforcement) return null;
            int activeCount = 0;
            foreach (var slot in characters.Values)
                if (slot.playerId == playerId && slot.state == CharacterSlotState.Active) activeCount++;
            if (activeCount >= profile.characterSlots) return null;

            var slotState = new OnlineCharacterSlot
            {
                characterId = Guid.NewGuid().ToString("N"),
                playerId = playerId,
                state = CharacterSlotState.Active,
                characterName = characterName,
                citizenId = "VCR-" + Guid.NewGuid().ToString("N").Substring(0, 10).ToUpperInvariant(),
                server = server,
                lifestyle = lifestyle,
                createdUtc = DateTime.UtcNow.ToString("O"),
                lastPlayedUtc = DateTime.UtcNow.ToString("O")
            };
            characters.Add(slotState.characterId, slotState);
            profile.activeCharacterId = slotState.characterId;
            return slotState;
        }

        public bool SelectCharacter(string playerId, string characterId)
        {
            OnlinePlayerProfile profile;
            OnlineCharacterSlot slot;
            if (!players.TryGetValue(playerId, out profile) || !characters.TryGetValue(characterId, out slot)) return false;
            if (slot.playerId != playerId || slot.state != CharacterSlotState.Active) return false;
            profile.activeCharacterId = characterId;
            slot.lastPlayedUtc = DateTime.UtcNow.ToString("O");
            return true;
        }

        public bool ArchiveCharacter(string playerId, string characterId)
        {
            OnlineCharacterSlot slot;
            OnlinePlayerProfile profile;
            if (!characters.TryGetValue(characterId, out slot) || !players.TryGetValue(playerId, out profile)) return false;
            if (slot.playerId != playerId || slot.state != CharacterSlotState.Active) return false;
            slot.state = CharacterSlotState.Archived;
            if (profile.activeCharacterId == characterId) profile.activeCharacterId = null;
            return true;
        }
    }
}
