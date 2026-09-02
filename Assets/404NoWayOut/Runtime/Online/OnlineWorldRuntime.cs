using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Online
{
    public enum Lifestyle { Legitimate, Criminal, LawEnforcement }
    public enum WorldServer { Veyron01, Veyron02, Veyron03 }
    public enum ForceRank { None, Recruit, Officer, Sergeant, Lieutenant, Captain, Chief }

    [Serializable]
    public sealed class OnlineCharacterState
    {
        public string playerId;
        public string citizenId;
        public string characterName;
        public WorldServer server;
        public Lifestyle lifestyle;
        public int balanceVcr;
        public string starterPropertyId;
        public string starterVehicleId;
        public ForceRank forceRank;
        public bool forceAccepted;
        public string createdUtc;
        public string lastLifestyleChangeUtc;
    }

    [Serializable]
    public sealed class PlayerTransfer
    {
        public string transferId;
        public string fromPlayerId;
        public string toPlayerId;
        public int amountVcr;
        public string reason;
        public string createdUtc;
    }

    public sealed class OnlineWorldRuntime : MonoBehaviour
    {
        public const int OneTimeBankGrantVcr = 10000000;
        public const double LifestyleCooldownHours = 2.0;
        private const double TicksPerHour = TimeSpan.TicksPerHour;

        private readonly Dictionary<string, OnlineCharacterState> characters = new Dictionary<string, OnlineCharacterState>();
        private readonly List<PlayerTransfer> transfers = new List<PlayerTransfer>();
        private readonly HashSet<string> grantIssued = new HashSet<string>();

        public IReadOnlyDictionary<string, OnlineCharacterState> Characters => characters;
        public IReadOnlyList<PlayerTransfer> Transfers => transfers;

        public OnlineCharacterState CreateCharacter(string playerId, string characterName, WorldServer server, Lifestyle lifestyle, string starterPropertyId, string starterVehicleId)
        {
            if (string.IsNullOrWhiteSpace(playerId) || characters.ContainsKey(playerId)) return null;
            if (lifestyle == Lifestyle.LawEnforcement) return null;
            var state = new OnlineCharacterState
            {
                playerId = playerId,
                citizenId = "VCR-" + Guid.NewGuid().ToString("N").Substring(0, 10).ToUpperInvariant(),
                characterName = characterName,
                server = server,
                lifestyle = lifestyle,
                balanceVcr = 0,
                starterPropertyId = starterPropertyId,
                starterVehicleId = starterVehicleId,
                forceRank = ForceRank.None,
                forceAccepted = false,
                createdUtc = DateTime.UtcNow.ToString("O")
            };
            characters[playerId] = state;
            IssueOneTimeGrant(playerId);
            return state;
        }

        public bool IssueOneTimeGrant(string playerId)
        {
            OnlineCharacterState state;
            if (!characters.TryGetValue(playerId, out state) || grantIssued.Contains(playerId)) return false;
            state.balanceVcr += OneTimeBankGrantVcr;
            grantIssued.Add(playerId);
            return true;
        }

        public bool TryChangeLifestyle(string playerId, Lifestyle newLifestyle)
        {
            OnlineCharacterState state;
            if (!characters.TryGetValue(playerId, out state)) return false;
            if (newLifestyle == Lifestyle.LawEnforcement && !state.forceAccepted) return false;
            if (state.lifestyle == newLifestyle) return true;
            if (!string.IsNullOrEmpty(state.lastLifestyleChangeUtc))
            {
                DateTime last;
                if (DateTime.TryParse(state.lastLifestyleChangeUtc, null, System.Globalization.DateTimeStyles.RoundtripKind, out last))
                    if ((DateTime.UtcNow - last).TotalHours < LifestyleCooldownHours) return false;
            }
            state.lifestyle = newLifestyle;
            state.lastLifestyleChangeUtc = DateTime.UtcNow.ToString("O");
            return true;
        }

        public bool TryTransfer(string fromPlayerId, string toPlayerId, int amountVcr, string reason)
        {
            if (amountVcr <= 0 || fromPlayerId == toPlayerId) return false;
            OnlineCharacterState from, to;
            if (!characters.TryGetValue(fromPlayerId, out from) || !characters.TryGetValue(toPlayerId, out to)) return false;
            if (from.balanceVcr < amountVcr) return false;
            from.balanceVcr -= amountVcr;
            to.balanceVcr += amountVcr;
            transfers.Add(new PlayerTransfer { transferId = Guid.NewGuid().ToString("N"), fromPlayerId = fromPlayerId, toPlayerId = toPlayerId, amountVcr = amountVcr, reason = reason, createdUtc = DateTime.UtcNow.ToString("O") });
            return true;
        }

        public bool SetForceAcceptance(string playerId, bool accepted, ForceRank rank)
        {
            OnlineCharacterState state;
            if (!characters.TryGetValue(playerId, out state)) return false;
            state.forceAccepted = accepted;
            state.forceRank = accepted ? rank : ForceRank.None;
            if (!accepted && state.lifestyle == Lifestyle.LawEnforcement) state.lifestyle = Lifestyle.Legitimate;
            return true;
        }
    }
}
