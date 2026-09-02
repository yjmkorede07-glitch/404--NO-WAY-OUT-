using UnityEngine;
using UnityEngine.SceneManagement;

namespace NoWayOut.Production
{
    public sealed class ProductionBootstrap : MonoBehaviour
    {
        [SerializeField] string initialScene = "404_Veyron_Production";
        void Awake() { DontDestroyOnLoad(gameObject); Application.targetFrameRate = 60; QualitySettings.vSyncCount = 0; }
        public void LoadWorld() { if (!string.IsNullOrWhiteSpace(initialScene)) SceneManager.LoadSceneAsync(initialScene); }
    }
}
