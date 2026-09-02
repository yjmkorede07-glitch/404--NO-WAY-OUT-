#if UNITY_EDITOR
using System.Collections.Generic;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using NoWayOut.World;

namespace NoWayOut.EditorTools
{
    public static class WorldGreyboxBuilder
    {
        private const float Km = 1000f;
        private static readonly (string id, string name, Vector2 center, Vector2 size, bool island)[] Regions =
        {
            ("veyron_central","Veyron Central",new Vector2(0,1),new Vector2(4,3),false),
            ("east_market","East Market",new Vector2(4,1),new Vector2(3,3),false),
            ("north_hills","North Hills",new Vector2(1,5),new Vector2(4,3),false),
            ("iron_district","Iron District",new Vector2(-4,1),new Vector2(3,3),false),
            ("west_coast","West Coast",new Vector2(-6,0),new Vector2(2,4),false),
            ("airport","Airport District",new Vector2(1,-4),new Vector2(4,2),false),
            ("port","Port Veyron",new Vector2(3,-5),new Vector2(4,2),false),
            ("outer_highway","Outer Highway",new Vector2(0,-2),new Vector2(12,1),false),
            ("rural_estates","Rural Estates",new Vector2(6,3),new Vector2(3,3),false),
            ("lakes_region","Lakes Region",new Vector2(-4,-4),new Vector2(4,2),false),
            ("north_range","North Range",new Vector2(-2,7),new Vector2(4,2),false),
            ("alpine_valley","Alpine Valley",new Vector2(3,7),new Vector2(4,2),false),
            ("snowline_resort","Snowline Resort",new Vector2(6,7),new Vector2(3,2),false),
            ("blackwater","Blackwater Island",new Vector2(7,8),new Vector2(3,2),true),
            ("crown","Crown Isle",new Vector2(9,2),new Vector2(3,2),true),
            ("redhaven","Redhaven Island",new Vector2(9,-2),new Vector2(3,2),true),
            ("solara","Solara Island",new Vector2(8,-7),new Vector2(3,2),true),
            ("gravesend","Gravesend Island",new Vector2(-4,-8),new Vector2(3,2),true)
        };

        [MenuItem("404/Build Phase 37 World Greybox")]
        public static void Build()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var root = new GameObject("404_World_Phase37");
            var stream = new GameObject("WorldStreamController").AddComponent<WorldStreamController>();
            stream.transform.SetParent(root.transform);

            CreateWater(root.transform);
            CreateMainland(root.transform);
            CreateRoadSpines(root.transform);

            foreach (var r in Regions) CreateRegion(root.transform, stream, r);
            CreatePlayerStart(root.transform);

            System.IO.Directory.CreateDirectory("Assets/404NoWayOut/Scenes");
            EditorSceneManager.SaveScene(scene, "Assets/404NoWayOut/Scenes/404_Veyron_Phase37_Greybox.unity");
            Debug.Log("404 Phase 37 world greybox built. Replace greybox geometry with production assets during asset production.");
        }

        private static void CreateWater(Transform parent)
        {
            var water = GameObject.CreatePrimitive(PrimitiveType.Cube);
            water.name = "WorldWater_Greybox";
            water.transform.SetParent(parent);
            water.transform.position = new Vector3(1500f, -5f, -500f);
            water.transform.localScale = new Vector3(22000f, 10f, 22000f);
        }

        private static void CreateMainland(Transform parent)
        {
            var land = GameObject.CreatePrimitive(PrimitiveType.Cube);
            land.name = "Veyron_Mainland_Greybox";
            land.transform.SetParent(parent);
            land.transform.position = new Vector3(0f, -1f, 0f);
            land.transform.localScale = new Vector3(16000f, 2f, 12000f);
        }

        private static void CreateRoadSpines(Transform parent)
        {
            CreateRoad(parent, "NorthSouth_Freeway", new Vector3(0,2,0), new Vector3(220,4,12000));
            CreateRoad(parent, "EastWest_Freeway", new Vector3(0,2,1500), new Vector3(16000,4,220));
            CreateRoad(parent, "Coastal_Route", new Vector3(-5200,2,0), new Vector3(180,4,10500));
            CreateRoad(parent, "Mountain_Route", new Vector3(1800,2,4700), new Vector3(11000,4,180));
        }

        private static void CreateRoad(Transform parent, string name, Vector3 pos, Vector3 scale)
        {
            var road = GameObject.CreatePrimitive(PrimitiveType.Cube);
            road.name = name;
            road.transform.SetParent(parent);
            road.transform.position = pos;
            road.transform.localScale = scale;
        }

        private static void CreateRegion(Transform parent, WorldStreamController stream, (string id,string name,Vector2 center,Vector2 size,bool island) r)
        {
            var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
            go.name = "Region_" + r.id;
            go.transform.SetParent(parent);
            go.transform.position = new Vector3(r.center.x * Km, r.island ? 0f : 3f, r.center.y * Km);
            go.transform.localScale = new Vector3(r.size.x * Km, r.island ? 4f : 6f, r.size.y * Km);
            var runtime = go.AddComponent<WorldRegionRuntime>();
            runtime.Configure(r.id, true);
            stream.Register(runtime);
            CreateDistrictMarker(go.transform, r.name);
        }

        private static void CreateDistrictMarker(Transform parent, string label)
        {
            var marker = new GameObject("GameplayMarker_" + label.Replace(" ", "_"));
            marker.transform.SetParent(parent);
            marker.transform.localPosition = new Vector3(0, 10, 0);
        }

        private static void CreatePlayerStart(Transform parent)
        {
            var player = new GameObject("PlayerStart_404");
            player.tag = "Player";
            player.transform.SetParent(parent);
            player.transform.position = new Vector3(0, 5, 1000);
            var capsule = player.AddComponent<CapsuleCollider>();
            capsule.height = 1.8f;
            capsule.radius = 0.35f;
            var camera = new GameObject("PlayerCamera").AddComponent<Camera>();
            camera.transform.SetParent(player.transform);
            camera.transform.localPosition = new Vector3(0, 1.6f, -4f);
            camera.transform.localRotation = Quaternion.identity;
        }
    }
}
#endif
