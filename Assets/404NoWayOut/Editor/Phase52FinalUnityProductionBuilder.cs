#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using System.IO;
using NoWayOut.Production;
using NoWayOut.Flow;
using NoWayOut.Settings;
using NoWayOut.Audio;
using NoWayOut.Mobile;
using NoWayOut.Streaming;

namespace NoWayOut.EditorTools
{
    public static class Phase52FinalUnityProductionBuilder
    {
        const string Root = "Assets/404NoWayOut";
        [MenuItem("404 > Build Phase 52 Final Unity Production Assembly")]
        public static void Build()
        {
            EnsureDirs();
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var root = new GameObject("404_FINAL_PRODUCTION_RUNTIME");
            root.AddComponent<FinalProductionCoordinator>();
            root.AddComponent<SettingsRuntime>();
            root.AddComponent<LoadingDirectorRuntime>();
            root.AddComponent<GameFlowRuntime>();
            root.AddComponent<WorldStreamingRuntime>();
            var audio = new GameObject("AudioDirector"); audio.transform.SetParent(root.transform); audio.AddComponent<AudioDirectorRuntime>();
            var mobile = new GameObject("MobileInput"); mobile.transform.SetParent(root.transform); mobile.AddComponent<MobileInputRuntime>();
            var ui = new GameObject("FinalHUD"); ui.transform.SetParent(root.transform); ui.AddComponent<NoWayOut.UI.FinalHudRuntime>();
            var cameraGo = new GameObject("ProductionCamera"); cameraGo.transform.position = new Vector3(0, 4, -8); cameraGo.AddComponent<Camera>();
            var light = new GameObject("ProductionKeyLight"); var l = light.AddComponent<Light>(); l.type = LightType.Directional; l.intensity = 1.0f; light.transform.rotation = Quaternion.Euler(45, -30, 0);
            EditorSceneManager.SaveScene(scene, Root + "/Scenes/404_Final_Unity_Production_Assembly.unity");
            AssetDatabase.SaveAssets(); AssetDatabase.Refresh();
            Debug.Log("Phase 52 final Unity production assembly generated.");
        }
        static void EnsureDirs() { Directory.CreateDirectory(Root + "/Scenes"); Directory.CreateDirectory(Root + "/Art/Final"); Directory.CreateDirectory(Root + "/Prefabs/Final"); }
    }
}
#endif
