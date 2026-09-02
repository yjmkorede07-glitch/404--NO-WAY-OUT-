#if UNITY_EDITOR
using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;

namespace NoWayOut.EditorTools
{
    public static class Phase53ProductionValidator
    {
        const string Root = "Assets/404NoWayOut";
        [MenuItem("404 > Validate Phase 53 Production Gate")]
        public static void Validate()
        {
            string project = Directory.GetParent(Application.dataPath).FullName;
            string dataRoot = Path.Combine(project, "Assets/404NoWayOut/Data");
            string missionDir = Path.Combine(dataRoot, "SourceOfTruth/Missions");
            string campaign = Path.Combine(dataRoot, "SourceOfTruth/campaign_88_missions.json");
            int errors = 0;
            if (!File.Exists(campaign)) { Debug.LogError("Missing campaign_88_missions.json"); errors++; }
            int missionFiles = Directory.Exists(missionDir) ? Directory.GetFiles(missionDir, "M*.json").Length : 0;
            if (missionFiles != 88) { Debug.LogError("Expected 88 mission source files; found " + missionFiles); errors++; }
            string[] required = {
                "Runtime/Player/GTAStyleLocomotionRuntime.cs",
                "Runtime/Combat/ThirdPersonWeaponInputRuntime.cs",
                "Runtime/Inventory/BackpackInventoryRuntime.cs",
                "Runtime/Health/HealthRecoveryRuntime.cs",
                "Runtime/UI/QuickUseWheelRuntime.cs",
                "Runtime/Online/OnlineWorldRuntime.cs",
                "Runtime/Multiplayer/AuthoritativeStateRuntime.cs",
                "Runtime/Prison/CustodyRuntime.cs",
                "Runtime/Maritime/MaritimeAircraftRuntime.cs",
                "Runtime/Streaming/WorldStreamingRuntime.cs",
                "Runtime/Cinematics/CinematicDirectorRuntime.cs",
                "Runtime/Production/FinalProductionCoordinator.cs",
                "Runtime/Production/ProductionBuildProfileRuntime.cs",
                "Runtime/Production/ContentIntegrityRuntime.cs"
            };
            foreach (var rel in required)
            {
                var abs = Path.Combine(Application.dataPath, "404NoWayOut", rel.Replace('/', Path.DirectorySeparatorChar));
                if (!File.Exists(abs)) { Debug.LogError("Missing required runtime artifact: " + rel); errors++; }
            }
            if (errors == 0) Debug.Log("PHASE 53 GATE: PASS — cumulative Unity source is structurally ready for Editor import/compile validation.");
            else Debug.LogError("PHASE 53 GATE: FAIL — " + errors + " issue(s).");
        }
    }
}
#endif
