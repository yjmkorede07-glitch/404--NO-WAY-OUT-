using System;
using UnityEngine;

namespace NoWayOut.Flow
{
    public enum GameFlowState { Boot, Profile, World, District, Interior, Mission, Cinematic, OnlineConnect, OnlineReconnect, ReturnToWorld, Title, Gameplay, Paused }

    public class GameFlowRuntime : MonoBehaviour
    {
        public static GameFlowRuntime Instance { get; private set; }
        public GameFlowState State { get; private set; } = GameFlowState.Boot;
        public event Action<GameFlowState> StateChanged;
        public string CurrentDistrict { get; private set; } = "Veyron Central";
        public string CurrentMission { get; private set; } = string.Empty;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this; DontDestroyOnLoad(gameObject);
        }

        public void SetState(GameFlowState next) { if (State == next) return; State = next; StateChanged?.Invoke(next); }
        public void SetWorld(string district) { CurrentDistrict = string.IsNullOrWhiteSpace(district) ? "Veyron Central" : district; SetState(GameFlowState.World); }
        public void SetMission(string missionId) { CurrentMission = missionId ?? string.Empty; SetState(GameFlowState.Mission); }
        public void EnterCinematic() => SetState(GameFlowState.Cinematic);
        public void ReturnToWorld() => SetState(GameFlowState.ReturnToWorld);
        public void Pause(bool paused) => SetState(paused ? GameFlowState.Paused : GameFlowState.Gameplay);
    }
}
