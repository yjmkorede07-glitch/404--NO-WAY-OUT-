#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using NoWayOut.World;
using NoWayOut.Player;
using NoWayOut.Interaction;
using NoWayOut.NPC;
using NoWayOut.Vehicles;
using NoWayOut.Police;
using NoWayOut.UI;

namespace NoWayOut.EditorTools
{
    public static class Phase38GameplaySceneBuilder
    {
        [MenuItem("404/Build Phase 38 Gameplay Test Scene")]
        public static void Build()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var root = new GameObject("404_Phase38_Gameplay_Test");
            CreateLight(root.transform);
            CreateGround(root.transform);
            CreatePlayer(root.transform);
            CreateNPC(root.transform, new Vector3(4,1,5), NPCArchetype.Civilian, "Resident - Talk");
            CreateNPC(root.transform, new Vector3(-4,1,5), NPCArchetype.Police, "Patrol Officer");
            CreateVehicle(root.transform, new Vector3(0,0.75f,5));
            CreateDoor(root.transform, new Vector3(0,1.2f,10));
            CreateMission(root.transform, new Vector3(8,1,3));
            var systems = new GameObject("WorldGameplaySystems"); systems.transform.SetParent(root.transform); systems.AddComponent<PoliceWorldRuntime>(); systems.AddComponent<ContextActionController>(); systems.AddComponent<GameplayHUD>();
            System.IO.Directory.CreateDirectory("Assets/404NoWayOut/Scenes");
            EditorSceneManager.SaveScene(scene, "Assets/404NoWayOut/Scenes/404_Phase38_GameplayTest.unity");
            Debug.Log("404 Phase 38 gameplay test scene built. Press Play to test movement, switching, dedicated interactions, vehicle entry and automatic doors.");
        }

        private static void CreateLight(Transform parent)
        {
            var go = new GameObject("Sun"); go.transform.SetParent(parent); go.transform.rotation = Quaternion.Euler(45f,-30f,0f); var light=go.AddComponent<Light>(); light.type=LightType.Directional; light.intensity=1.2f;
        }

        private static void CreateGround(Transform parent)
        {
            var ground=GameObject.CreatePrimitive(PrimitiveType.Plane); ground.name="Veyron_Central_Gameplay_Ground"; ground.transform.SetParent(parent); ground.transform.localScale=new Vector3(8f,1f,8f);
        }

        private static void CreatePlayer(Transform parent)
        {
            var managerGo=new GameObject("ProtagonistManager"); managerGo.transform.SetParent(parent); var manager=managerGo.AddComponent<ProtagonistRuntimeManager>();
            var cameraGo=new GameObject("ThirdPersonCamera"); cameraGo.transform.SetParent(parent); cameraGo.tag="MainCamera"; cameraGo.AddComponent<Camera>(); var rig=cameraGo.AddComponent<ThirdPersonCamera>();
            string[] names={"Darius Cole","Malik Reed","Amara Vale"};
            for(int i=0;i<3;i++)
            {
                var p=GameObject.CreatePrimitive(PrimitiveType.Capsule); p.name=names[i]; p.tag="Player"; p.transform.SetParent(parent); p.transform.position=new Vector3(i*2f,1f,0f); Object.DestroyImmediate(p.GetComponent<CapsuleCollider>()); p.AddComponent<CharacterController>(); p.AddComponent<ThirdPersonPlayerController>(); p.AddComponent<ContextActionController>(); manager.Register(p); p.SetActive(i==0);
            }
            manager.SwitchTo(0); rig.SetTarget(manager.ActiveProtagonist);
        }

        private static void CreateNPC(Transform parent, Vector3 position, NPCArchetype archetype, string name)
        {
            var npc=GameObject.CreatePrimitive(PrimitiveType.Capsule); npc.name=name; npc.transform.SetParent(parent); npc.transform.position=position; npc.AddComponent<NPCWorldAgent>().Configure(archetype,name);
        }

        private static void CreateVehicle(Transform parent, Vector3 position)
        {
            var car=GameObject.CreatePrimitive(PrimitiveType.Cube); car.name="Vyr Sable - Vehicle Test"; car.transform.SetParent(parent); car.transform.position=position; car.transform.localScale=new Vector3(1.8f,0.7f,3.6f); car.AddComponent<VehicleRuntime>(); var target=car.AddComponent<InteractionTarget>(); target.Configure(InteractionKind.EnterVehicle,"Vyr Sable",3f);
        }

        private static void CreateDoor(Transform parent, Vector3 position)
        {
            var door=GameObject.CreatePrimitive(PrimitiveType.Cube); door.name="AutomaticDoor - No Button"; door.transform.SetParent(parent); door.transform.position=position; door.transform.localScale=new Vector3(2.2f,2.4f,0.25f); door.AddComponent<AutomaticDoor>(); var trigger=door.AddComponent<BoxCollider>(); trigger.isTrigger=true; trigger.size=new Vector3(3f,3f,3f);
        }

        private static void CreateMission(Transform parent, Vector3 position)
        {
            var marker=GameObject.CreatePrimitive(PrimitiveType.Cylinder); marker.name="M01_Mission_Start"; marker.transform.SetParent(parent); marker.transform.position=position; marker.transform.localScale=new Vector3(1f,2f,1f); marker.AddComponent<NoWayOut.Missions.MissionTriggerRuntime>();
        }
    }
}
#endif
