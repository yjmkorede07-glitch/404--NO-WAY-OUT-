#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using NoWayOut.Loading;

namespace NoWayOut.EditorTools
{
    public static class DevelopmentSceneBuilder
    {
        [MenuItem("404/Build Development Scene")]
        public static void Build()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
            var loading = new GameObject("LoadingStateController");
            loading.AddComponent<LoadingStateController>();
            var player = new GameObject("Player_Prototype");
            player.tag = "Player";
            var collider = player.AddComponent<CapsuleCollider>();
            collider.height = 1.8f;
            collider.radius = 0.35f;
            var door = GameObject.CreatePrimitive(PrimitiveType.Cube);
            door.name = "AutomaticDoor_Prototype";
            door.transform.position = new Vector3(0f, 1f, 3f);
            door.transform.localScale = new Vector3(2f, 2f, 0.2f);
            var trigger = new GameObject("DoorTrigger");
            trigger.transform.SetParent(door.transform);
            trigger.transform.localPosition = new Vector3(0f, 0f, -1.5f);
            var box = trigger.AddComponent<BoxCollider>();
            box.isTrigger = true;
            box.size = new Vector3(3f, 2f, 3f);
            door.AddComponent<NoWayOut.World.AutomaticDoor>();
            System.IO.Directory.CreateDirectory("Assets/404NoWayOut/Scenes");
            EditorSceneManager.SaveScene(scene, "Assets/404NoWayOut/Scenes/404_Development.unity");
            Selection.activeGameObject = player;
        }
    }
}
#endif
