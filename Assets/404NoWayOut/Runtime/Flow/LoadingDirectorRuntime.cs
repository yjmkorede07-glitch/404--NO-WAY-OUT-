using System;
using UnityEngine;

namespace NoWayOut.Flow
{
    public enum LoadingStage { Booting, Profile, World, District, Interior, Mission, Cinematic, OnlineConnect, OnlineReconnect, ReturnToWorld }

    public class LoadingDirectorRuntime : MonoBehaviour
    {
        public LoadingStage Stage { get; private set; } = LoadingStage.Booting;
        public string District { get; private set; } = "Veyron Central";
        public string Mission { get; private set; } = string.Empty;
        public event Action<LoadingStage> StageChanged;
        public void Begin(LoadingStage stage, string district, string mission = "")
        {
            Stage = stage; District = string.IsNullOrWhiteSpace(district) ? "Veyron Central" : district; Mission = mission ?? string.Empty; StageChanged?.Invoke(Stage);
        }
        public void CompleteToWorld() { Stage = LoadingStage.ReturnToWorld; StageChanged?.Invoke(Stage); }
    }
}
