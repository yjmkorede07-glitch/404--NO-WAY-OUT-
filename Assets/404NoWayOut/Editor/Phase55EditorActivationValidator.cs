#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;

namespace NoWayOut.EditorTools
{
    public static class Phase55EditorActivationValidator
    {
        private const string ExpectedUnityVersion = "6000.3.0f1";
        private const string ProjectRoot = "Assets/404NoWayOut";

        [MenuItem("404/Validate Phase 55 Editor Activation")]
        public static void Validate()
        {
            var report = RunChecks();
            foreach (var item in report)
            {
                var line = string.Format("404 Phase 55 | {0} | {1}", item.id, item.status);
                if (item.status == "READY") Debug.Log(line);
                else if (item.required) Debug.LogWarning(line);
                else Debug.Log(line);
            }

            if (report.Exists(x => x.required && x.status != "READY"))
                Debug.LogError("404 Phase 55: editor activation gate FAILED. Fix the required items before production scene validation.");
            else
                Debug.Log("404 Phase 55: editor activation gate PASSED.");
        }

        [Serializable]
        public sealed class CheckResult
        {
            public string id;
            public bool required;
            public string status;
            public string detail;
        }

        public static List<CheckResult> RunChecks()
        {
            var results = new List<CheckResult>();
            Add(results, "unity_version", true,
                Application.unityVersion == ExpectedUnityVersion ? "READY" : "BLOCKED",
                Application.unityVersion);

            Add(results, "project_root", true,
                Directory.Exists(ProjectRoot) ? "READY" : "MISSING",
                ProjectRoot);

            Add(results, "source_of_truth", true,
                File.Exists(ProjectRoot + "/Data/SourceOfTruth/campaign_88_missions.json") ? "READY" : "MISSING",
                "campaign_88_missions.json");

            Add(results, "phase54_gate", true,
                File.Exists(ProjectRoot + "/Runtime/Production/PreEditorProductionGate.cs") ? "READY" : "MISSING",
                "PreEditorProductionGate.cs");

            Add(results, "addressables_registry", true,
                File.Exists(ProjectRoot + "/Runtime/Addressables/ContentAddressRegistry.cs") ? "READY" : "MISSING",
                "ContentAddressRegistry.cs");

            Add(results, "phase55_validator", true,
                File.Exists(ProjectRoot + "/Editor/Phase55EditorActivationValidator.cs") ? "READY" : "MISSING",
                "Phase55EditorActivationValidator.cs");

            Add(results, "production_scene", false,
                File.Exists(ProjectRoot + "/Scenes/404_Veyron_Phase37_Greybox.unity") ? "READY" : "NOT_BUILT",
                "existing greybox scene");

            Add(results, "phase54_scene", false,
                File.Exists(ProjectRoot + "/Scenes/404_PreEditor_Production_Gate.unity") ? "READY" : "NOT_BUILT",
                "pre-editor gate scene");

            Add(results, "final_3d_content", true, "CONTENT_IMPORT_REQUIRED",
                "Final rights-cleared 3D assets, materials, lighting and audio still require the real Unity Editor machine.");

            Add(results, "playmode_compile", true, "BLOCKED_UNTIL_UNITY",
                "This package prepares the gate; actual Unity compile and Play Mode must run in Unity 6.3 LTS.");

            return results;
        }

        private static void Add(List<CheckResult> results, string id, bool required, string status, string detail)
        {
            results.Add(new CheckResult { id = id, required = required, status = status, detail = detail });
        }
    }
}
#endif
