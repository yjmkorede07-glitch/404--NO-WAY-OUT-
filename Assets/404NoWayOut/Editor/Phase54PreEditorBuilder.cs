#if UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEngine;

namespace NoWayOut.EditorTools
{
    public static class Phase54PreEditorBuilder
    {
        [MenuItem("404/Build Phase 54 Pre-Editor Production Scene")]
        public static void BuildScene()
        {
            var scene = new UnityEngine.SceneManagement.Scene();
            var path = "Assets/404NoWayOut/Scenes/404_PreEditor_Production_Gate.unity";
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            var created = UnityEditor.SceneManagement.EditorSceneManager.NewScene(UnityEditor.SceneManagement.NewSceneSetup.EmptyScene, UnityEditor.SceneManagement.NewSceneMode.Single);
            var gate = new GameObject("404_PreEditorProductionGate");
            var component = gate.AddComponent<NoWayOut.Production.PreEditorProductionGate>();
            component.LoadDefaultContract();
            UnityEditor.SceneManagement.EditorSceneManager.SaveScene(created, path);
            AssetDatabase.SaveAssets();
            Debug.Log("404 Phase 54: pre-editor production gate scene built at " + path);
        }
    }
}
#endif
