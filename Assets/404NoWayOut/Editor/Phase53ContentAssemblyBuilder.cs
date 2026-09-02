#if UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using NoWayOut.Production;

namespace NoWayOut.EditorTools
{
    public static class Phase53ContentAssemblyBuilder
    {
        const string Root = "Assets/404NoWayOut";
        const string ScenePath = Root + "/Scenes/404_Phase53_Content_Assembly.unity";
        const string ProfilePath = Root + "/Data/Production/NwoProductionBuildProfile.asset";

        [MenuItem("404 > Build Phase 53 Content Assembly")]
        public static void Build()
        {
            EnsureDirs();
            var profile = AssetDatabase.LoadAssetAtPath<ProductionBuildProfileRuntime>(ProfilePath);
            if (profile == null)
            {
                profile = ScriptableObject.CreateInstance<ProductionBuildProfileRuntime>();
                profile.name = "NwoProductionBuildProfile";
                AssetDatabase.CreateAsset(profile, ProfilePath);
            }

            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var root = new GameObject("404_PHASE53_CONTENT_ASSEMBLY");
            var integrity = root.AddComponent<ContentIntegrityRuntime>();
            integrity.SetStatus(88, 4, false, false, false);
            var coordinator = root.AddComponent<FinalProductionCoordinator>();
            var marker = new GameObject("CONTENT_PIPELINE_STATUS");
            marker.transform.SetParent(root.transform);
            marker.AddComponent<Phase53AssemblyMarker>();
            var cameraGo = new GameObject("AssemblyCamera");
            cameraGo.transform.position = new Vector3(0, 3, -7);
            cameraGo.AddComponent<Camera>();
            EditorSceneManager.SaveScene(scene, ScenePath);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log("Phase 53 content assembly generated: " + ScenePath);
        }

        static void EnsureDirs()
        {
            Directory.CreateDirectory(Root + "/Scenes");
            Directory.CreateDirectory(Root + "/Data/Production");
        }
    }

    public sealed class Phase53AssemblyMarker : MonoBehaviour
    {
        [SerializeField] string phase = "53";
        [SerializeField] string purpose = "Cumulative Unity content assembly and production QA gate";
    }
}
#endif
