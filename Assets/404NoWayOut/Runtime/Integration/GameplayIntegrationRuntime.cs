using System;
using UnityEngine;
using NoWayOut.Missions;
using NoWayOut.Combat;
using NoWayOut.Player;
using NoWayOut.Cinematics;
using NoWayOut.Police;
using NoWayOut.Vehicles;

namespace NoWayOut.Integration
{
    public enum IntegratedGameplayState { Freeroam, MissionBriefing, MissionActive, Cinematic, Vehicle, Downed, Custody, OnlineSync }

    public sealed class GameplayIntegrationRuntime : MonoBehaviour
    {
        [Header("Core runtime references")]
        [SerializeField] MissionRuntimeManager missions;
        [SerializeField] CombatRuntime combat;
        [SerializeField] GTAStyleLocomotionRuntime locomotion;
        [SerializeField] CinematicDirectorRuntime cinematics;
        [SerializeField] PolicePursuitRuntime police;
        [SerializeField] VehicleRuntime vehicle;

        public IntegratedGameplayState State { get; private set; } = IntegratedGameplayState.Freeroam;
        public bool IsInMission => missions != null && missions.State == MissionState.Active;
        public bool CanReceiveGameplayInput => State == IntegratedGameplayState.Freeroam || State == IntegratedGameplayState.MissionActive || State == IntegratedGameplayState.Vehicle;
        public event Action<IntegratedGameplayState> StateChanged;

        void Awake()
        {
            if (missions != null) missions.StateChanged += OnMissionState;
            if (combat != null) combat.Damaged += OnDamaged;
        }

        void OnDestroy()
        {
            if (missions != null) missions.StateChanged -= OnMissionState;
            if (combat != null) combat.Damaged -= OnDamaged;
        }

        void Update()
        {
            if (combat != null && combat.IsDead) SetState(IntegratedGameplayState.Downed);
            else if (missions != null && missions.State == MissionState.Active && State != IntegratedGameplayState.Cinematic) SetState(IntegratedGameplayState.MissionActive);
            else if (missions != null && missions.State == MissionState.FreeRoamReturn) SetState(IntegratedGameplayState.Freeroam);
        }

        void OnMissionState(MissionState next)
        {
            switch (next)
            {
                case MissionState.Briefing: SetState(IntegratedGameplayState.MissionBriefing); break;
                case MissionState.OpeningCinematic:
                case MissionState.PostCinematic: SetState(IntegratedGameplayState.Cinematic); break;
                case MissionState.Active:
                case MissionState.Checkpoint: SetState(IntegratedGameplayState.MissionActive); break;
                case MissionState.FreeRoamReturn:
                case MissionState.Available: SetState(IntegratedGameplayState.Freeroam); break;
            }
        }

        void OnDamaged(CombatDamageEvent damage)
        {
            if (damage.amount > 0f && combat != null && combat.IsDead) SetState(IntegratedGameplayState.Downed);
        }

        public void SetVehicleState(bool entered)
        {
            if (entered) SetState(IntegratedGameplayState.Vehicle);
            else if (missions != null && missions.State == MissionState.Active) SetState(IntegratedGameplayState.MissionActive);
            else SetState(IntegratedGameplayState.Freeroam);
        }

        public void BeginCinematic() { SetState(IntegratedGameplayState.Cinematic); if (locomotion != null) locomotion.CanMove = false; }
        public void EndCinematic() { if (locomotion != null) locomotion.CanMove = true; SetState(IsInMission ? IntegratedGameplayState.MissionActive : IntegratedGameplayState.Freeroam); }
        public void EnterOnlineSyncState() { SetState(IntegratedGameplayState.OnlineSync); }
        public void ExitOnlineSyncState() { SetState(IsInMission ? IntegratedGameplayState.MissionActive : IntegratedGameplayState.Freeroam); }

        void SetState(IntegratedGameplayState next)
        {
            if (State == next) return;
            State = next;
            StateChanged?.Invoke(next);
        }
    }
}
