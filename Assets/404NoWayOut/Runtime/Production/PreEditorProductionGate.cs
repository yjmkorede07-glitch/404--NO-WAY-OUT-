using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Production
{
    public sealed class PreEditorProductionGate : MonoBehaviour
    {
        [Serializable] public struct GateItem { public string id; public bool required; public string status; }
        [SerializeField] private List<GateItem> items = new List<GateItem>();
        public IReadOnlyList<GateItem> Items => items;
        public bool IsReadyForEditor => items.TrueForAll(i => !i.required || string.Equals(i.status, "READY", StringComparison.OrdinalIgnoreCase));
        public void LoadDefaultContract()
        {
            items = new List<GateItem>
            {
                new GateItem { id="unity_project", required=true, status="READY" },
                new GateItem { id="source_of_truth", required=true, status="READY" },
                new GateItem { id="story_88", required=true, status="READY" },
                new GateItem { id="endings_4", required=true, status="READY" },
                new GateItem { id="gameplay_runtime", required=true, status="READY" },
                new GateItem { id="online_runtime", required=true, status="READY" },
                new GateItem { id="world_streaming", required=true, status="READY" },
                new GateItem { id="asset_import_targets", required=true, status="READY" },
                new GateItem { id="editor_validation", required=true, status="READY" },
                new GateItem { id="runtime_compile_playmode", required=true, status="BLOCKED_UNTIL_UNITY" },
                new GateItem { id="device_builds", required=true, status="BLOCKED_UNTIL_UNITY" },
                new GateItem { id="final_3d_art_audio_vo", required=true, status="CONTENT_IMPORT_REQUIRED" }
            };
        }
    }
}
