using UnityEngine;

namespace NoWayOut
{
    public sealed class NoWayOutBootstrap : MonoBehaviour
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void Bootstrap()
        {
            if (FindFirstObjectByType<NoWayOutBootstrap>() != null) return;
            var root = new GameObject("404_Runtime");
            DontDestroyOnLoad(root);
            root.AddComponent<NoWayOutBootstrap>();
        }
    }
}
