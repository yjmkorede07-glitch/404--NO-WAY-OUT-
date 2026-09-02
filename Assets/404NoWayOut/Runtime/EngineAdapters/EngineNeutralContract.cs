using UnityEngine;

namespace NoWayOut.EngineAdapters
{
    public static class EngineNeutralContract
    {
        public static Vector3 ToUnityPosition(double x, double y, double z) => new((float)x, (float)y, (float)z);
        public static Vector3 ToUnityEuler(double x, double y, double z) => new((float)x, (float)y, (float)z);
    }
}
