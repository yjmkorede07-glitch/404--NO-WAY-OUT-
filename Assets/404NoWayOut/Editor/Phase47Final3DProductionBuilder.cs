#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEditor.SceneManagement;
using System.IO;

namespace NoWayOut.EditorTools
{
    public static class Phase47Final3DProductionBuilder
    {
        const string Root = "Assets/404NoWayOut";
        [MenuItem("404 > Build Phase 47 Final 3D Production Scene")]
        public static void Build()
        {
            EnsureDirs();
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var world = new GameObject("WORLD_VeyronCentral_VerticalSlice");
            BuildTerrain(world.transform); BuildRoads(world.transform); BuildBuildings(world.transform); BuildProps(world.transform); BuildVehicles(world.transform); BuildCharacters(world.transform); BuildCameras(world.transform); BuildLighting(world.transform);
            EditorSceneManager.SaveScene(scene, Root + "/Scenes/404_Veyron_Phase47_Final3D_VerticalSlice.unity");
            AssetDatabase.SaveAssets(); AssetDatabase.Refresh();
            Debug.Log("Phase 47 3D production vertical slice generated.");
        }
        static void EnsureDirs(){ foreach(var p in new[]{Root+"/Scenes",Root+"/Prefabs/World",Root+"/Prefabs/Characters",Root+"/Prefabs/Vehicles",Root+"/Materials",Root+"/Art/Environment",Root+"/Art/Characters",Root+"/Art/Vehicles",Root+"/Art/Cinematics"}) Directory.CreateDirectory(p); }
        static GameObject Cube(Transform p,string n,Vector3 pos,Vector3 scale){var g=GameObject.CreatePrimitive(PrimitiveType.Cube);g.name=n;g.transform.SetParent(p);g.transform.localPosition=pos;g.transform.localScale=scale;return g;}
        static GameObject Cyl(Transform p,string n,Vector3 pos,float r,float h){var g=GameObject.CreatePrimitive(PrimitiveType.Cylinder);g.name=n;g.transform.SetParent(p);g.transform.localPosition=pos;g.transform.localScale=new Vector3(r,h/2f,r);return g;}
        static void BuildTerrain(Transform p){Cube(p,"Terrain_Base",new Vector3(0,-1,0),new Vector3(300,2,220)); Cube(p,"Water_Canal",new Vector3(110,-.2f,55),new Vector3(70,.2f,30));}
        static void BuildRoads(Transform p){foreach(var z in new[]{-80f,-40f,0f,40f,80f})Cube(p,"Road_Main_"+z,new Vector3(0,0,z),new Vector3(300,.15f,10)); foreach(var x in new[]{-120f,-60f,0f,60f,120f})Cube(p,"Road_Cross_"+x,new Vector3(x,.05f,0),new Vector3(10,.15f,220));}
        static void BuildBuildings(Transform p){for(int x=-100;x<=100;x+=40)for(int z=-60;z<=60;z+=40){if((x+z)%80==0)continue;float h=12+((x*x+z*z)%28);Cube(p,$"Building_{x}_{z}",new Vector3(x,h/2,z),new Vector3(28,h,28));}}
        static void BuildProps(Transform p){for(int i=0;i<30;i++){float x=-130+(i*37)%260,z=-95+(i*53)%190;Cyl(p,"StreetProp_"+i,new Vector3(x,2,z),.35f,4f);}}
        static void BuildVehicles(Transform p){var car=Cube(p,"Vehicle_Demo_Sedan",new Vector3(12,1,12),new Vector3(5,1.2f,2.2f)); Cube(p,"Vehicle_Demo_Boat",new Vector3(110,1,55),new Vector3(8,1.2f,3)); Cube(p,"Vehicle_Demo_Helicopter",new Vector3(-90,5,80),new Vector3(5,2,3));}
        static void BuildCharacters(Transform p){foreach(var n in new[]{"Darius_Cole","Malik_Reed","Amara_Vale"}){var root=Cyl(p,n,new Vector3(-10,2,10),.65f,3.5f);Cyl(root.transform,n+"_Head",new Vector3(0,2.1f,0),.55f,1.1f);}}
        static void BuildCameras(Transform p){var cam=new GameObject("CinematicCamera_Opening");cam.transform.SetParent(p);cam.transform.position=new Vector3(-55,28,-55);cam.transform.LookAt(new Vector3(0,8,0));cam.AddComponent<Camera>();var cam2=new GameObject("GameplayCamera_Target");cam2.transform.SetParent(p);cam2.transform.position=new Vector3(0,8,-15);cam2.AddComponent<Camera>().enabled=false;}
        static void BuildLighting(Transform p){var sun=new GameObject("Sun_Key");sun.transform.SetParent(p);var l=sun.AddComponent<Light>();l.type=LightType.Directional;l.intensity=1.1f;sun.transform.rotation=Quaternion.Euler(45,-30,0);var env=new GameObject("World_Lighting");env.transform.SetParent(p);}
    }
}
#endif
