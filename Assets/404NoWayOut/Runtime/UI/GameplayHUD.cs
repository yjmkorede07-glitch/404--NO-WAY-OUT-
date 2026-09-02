using UnityEngine;
using NoWayOut.Interaction;
using NoWayOut.Police;

namespace NoWayOut.UI
{
    public sealed class GameplayHUD : MonoBehaviour
    {
        private ContextActionController interaction;
        private PoliceWorldRuntime police;
        private GUIStyle title;
        private GUIStyle body;

        private void Start()
        {
            interaction = FindFirstObjectByType<ContextActionController>();
            police = FindFirstObjectByType<PoliceWorldRuntime>();
            title = new GUIStyle(GUI.skin.label) { fontSize = 22, fontStyle = FontStyle.Bold };
            body = new GUIStyle(GUI.skin.label) { fontSize = 15 };
        }

        private void OnGUI()
        {
            if (title == null) Start();
            GUI.Label(new Rect(20, 18, 500, 35), "404: NO WAY OUT", title);
            if (interaction != null && interaction.Current != null)
            {
                string key = KeyFor(interaction.Current.Kind);
                GUI.Label(new Rect(20, 55, 650, 30), key + "  " + interaction.Current.DisplayName, body);
            }
            GUI.Label(new Rect(20, 82, 900, 100), "WASD Move   SHIFT Sprint   Mouse Camera   1/2/3 Switch   T Talk   F Vehicle   G Rob   H Detain   J Arrest   B Board", body);
            if (police != null && police.WantedStars > 0)
                GUI.Label(new Rect(Screen.width - 180, 20, 160, 35), "WANTED  " + new string('★', police.WantedStars), title);
        }

        private static string KeyFor(InteractionKind kind)
        {
            switch (kind)
            {
                case InteractionKind.Talk: return "[T]";
                case InteractionKind.EnterVehicle:
                case InteractionKind.ExitVehicle: return "[F]";
                case InteractionKind.Robbery: return "[G]";
                case InteractionKind.Detain: return "[H]";
                case InteractionKind.Arrest: return "[J]";
                case InteractionKind.BoardBoat:
                case InteractionKind.EnterAircraft: return "[B]";
                default: return "[ACTION]";
            }
        }
    }
}
