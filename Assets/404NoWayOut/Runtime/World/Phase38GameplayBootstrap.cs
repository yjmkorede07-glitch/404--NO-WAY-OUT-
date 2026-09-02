using UnityEngine;
using NoWayOut.Player;
using NoWayOut.NPC;
using NoWayOut.Interaction;
using NoWayOut.Vehicles;
using NoWayOut.Police;

namespace NoWayOut.World
{
    public sealed class Phase38GameplayBootstrap : MonoBehaviour
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void CreateIfNeeded()
        {
            if (FindFirstObjectByType<Phase38GameplayBootstrap>() != null) return;
            var root = new GameObject("404_Phase38_Runtime");
            DontDestroyOnLoad(root);
            root.AddComponent<Phase38GameplayBootstrap>().BuildDevelopmentWorld();
        }

        private void BuildDevelopmentWorld()
        {
            if (FindFirstObjectByType<Camera>() != null) return;
            var ground = GameObject.CreatePrimitive(PrimitiveType.Plane); ground.name = "Veyron_Central_Ground"; ground.transform.localScale = new Vector3(20f,1f,20f);
            var playerManager = gameObject.AddComponent<ProtagonistRuntimeManager>();
            var cameraObj = new GameObject("ThirdPersonCamera"); var cam = cameraObj.AddComponent<Camera>(); cameraObj.tag = "MainCamera"; cameraObj.AddComponent<ThirdPersonCamera>();
            var camRig = cameraObj.GetComponent<ThirdPersonCamera>();
            var names = new[] { "Darius Cole", "Malik Reed", "Amara Vale" };
            for (int i=0;i<3;i++)
            {
                var p = GameObject.CreatePrimitive(PrimitiveType.Capsule); p.name = names[i]; p.tag = "Player"; p.transform.position = new Vector3(i*2f,1f,0f); p.SetActive(i==0);
                Object.Destroy(p.GetComponent<CapsuleCollider>()); p.AddComponent<CharacterController>(); p.AddComponent<NoWayOut.Player.ThirdPersonPlayerController>(); p.AddComponent<ContextActionController>(); playerManager.Register(p);
            }
            playerManager.SwitchTo(0); camRig.SetTarget(playerManager.ActiveProtagonist);
            var police = new GameObject("NPC_Police_System"); police.AddComponent<PoliceWorldRuntime>(); gameObject.AddComponent<NoWayOut.UI.GameplayHUD>();
            SpawnNPC(new Vector3(4,1,5), NPCArchetype.Civilian, "Veyron Resident"); SpawnNPC(new Vector3(-4,1,5), NPCArchetype.Police, "Patrol Officer");
            var car = GameObject.CreatePrimitive(PrimitiveType.Cube); car.name="Vyr Sable - Development Vehicle"; car.transform.position=new Vector3(0,0.75f,5); car.transform.localScale=new Vector3(1.8f,0.7f,3.6f); car.AddComponent<VehicleRuntime>(); var target=car.AddComponent<InteractionTarget>(); target.Configure(InteractionKind.EnterVehicle,"Vyr Sable");
            var doorRoot = GameObject.CreatePrimitive(PrimitiveType.Cube); doorRoot.name="Automatic_Residential_Door"; doorRoot.transform.position=new Vector3(0,1.2f,10); doorRoot.transform.localScale=new Vector3(2.2f,2.4f,0.25f); var door=doorRoot.AddComponent<AutomaticDoor>(); var trigger=doorRoot.AddComponent<BoxCollider>(); trigger.isTrigger=true; trigger.size=new Vector3(3f,3f,3f);
            var mission = GameObject.CreatePrimitive(PrimitiveType.Cylinder); mission.name="M01 Mission Start"; mission.transform.position=new Vector3(8,1,3); mission.transform.localScale=new Vector3(1,2,1); mission.AddComponent<NoWayOut.Missions.MissionTriggerRuntime>();
            Debug.Log("404 Phase 38 development world initialized. Controls: WASD move, Shift sprint, mouse camera, 1/2/3 protagonists, T talk, F vehicle, G robbery, H detain, J arrest, B board.");
        }

        private void SpawnNPC(Vector3 position, NPCArchetype type, string name)
        {
            var npc = GameObject.CreatePrimitive(PrimitiveType.Capsule); npc.transform.position=position; npc.name=name; var agent=npc.AddComponent<NPCWorldAgent>(); agent.Configure(type,name);
        }
    }
}
