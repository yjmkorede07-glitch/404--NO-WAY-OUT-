using UnityEngine;
using NoWayOut.Flow;
using NoWayOut.Settings;

namespace NoWayOut.UI
{
    public class FinalHudRuntime : MonoBehaviour
    {
        public string DistrictLabel => GameFlowRuntime.Instance ? GameFlowRuntime.Instance.CurrentDistrict : "Veyron Central";
        public string MissionLabel => GameFlowRuntime.Instance ? GameFlowRuntime.Instance.CurrentMission : string.Empty;
        public bool ShowSubtitles => SettingsRuntime.Instance ? SettingsRuntime.Instance.Data.subtitles : true;
        public bool HighContrast => SettingsRuntime.Instance && SettingsRuntime.Instance.Data.highContrast;
    }
}
