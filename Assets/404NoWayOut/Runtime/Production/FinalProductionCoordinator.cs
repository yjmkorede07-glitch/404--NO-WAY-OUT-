using UnityEngine;
using NoWayOut.Flow;
using NoWayOut.Settings;
using NoWayOut.Streaming;

namespace NoWayOut.Production
{
    public class FinalProductionCoordinator : MonoBehaviour
    {
        public static FinalProductionCoordinator Instance { get; private set; }
        public GameFlowRuntime Flow { get; private set; }
        public LoadingDirectorRuntime Loading { get; private set; }
        public SettingsRuntime Settings { get; private set; }
        public WorldStreamingRuntime Streaming { get; private set; }
        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this; DontDestroyOnLoad(gameObject);
            Flow = GetComponentInChildren<GameFlowRuntime>(true) ?? gameObject.AddComponent<GameFlowRuntime>();
            Loading = GetComponentInChildren<LoadingDirectorRuntime>(true) ?? gameObject.AddComponent<LoadingDirectorRuntime>();
            Settings = GetComponentInChildren<SettingsRuntime>(true) ?? gameObject.AddComponent<SettingsRuntime>();
            Streaming = GetComponentInChildren<WorldStreamingRuntime>(true) ?? gameObject.AddComponent<WorldStreamingRuntime>();
        }
        public void BootToTitle() { Loading.Begin(LoadingStage.Booting, "Veyron Central"); Flow.SetState(GameFlowState.Title); }
        public void StartStory() { Loading.Begin(LoadingStage.World, "Veyron Central"); Flow.SetWorld("Veyron Central"); }
        public void ConnectOnline() { Loading.Begin(LoadingStage.OnlineConnect, "Veyron Central"); Flow.SetState(GameFlowState.OnlineConnect); }
    }
}
