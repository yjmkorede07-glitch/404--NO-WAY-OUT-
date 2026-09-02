using UnityEngine;

namespace NoWayOut.Production
{
    public enum NwoPlatformProfile { PC, Mobile, Console }

    [CreateAssetMenu(menuName = "404/Production Build Profile", fileName = "NwoProductionBuildProfile")]
    public sealed class ProductionBuildProfileRuntime : ScriptableObject
    {
        public NwoPlatformProfile platform = NwoPlatformProfile.PC;
        [Min(30)] public int targetFrameRate = 60;
        [Min(1)] public int maxLocalPlayers = 1;
        [Min(1)] public int maxVisibleNpcAgents = 80;
        [Min(1)] public int maxActiveVehicles = 40;
        [Min(1)] public int maxActiveAudioSources = 64;
        [Min(1)] public int maxWorldStreamCells = 12;
        public bool enableDynamicResolution = true;
        public bool enableOcclusionCulling = true;
        public bool enableGpuInstancing = true;
        public bool enableAddressableContent = true;

        public void ApplyRuntimeDefaults()
        {
            Application.targetFrameRate = targetFrameRate;
            QualitySettings.vSyncCount = 0;
        }
    }
}
