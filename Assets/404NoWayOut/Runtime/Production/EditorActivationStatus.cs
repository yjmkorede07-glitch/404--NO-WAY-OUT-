using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Production
{
    public sealed class EditorActivationStatus : MonoBehaviour
    {
        [Serializable]
        public struct StatusItem
        {
            public string id;
            public bool required;
            public string status;
        }

        [SerializeField] private StatusItem[] items = Array.Empty<StatusItem>();
        public IReadOnlyList<StatusItem> Items => items;

        public void LoadDefaultContract()
        {
            items = new[]
            {
                new StatusItem { id = "unity_6_3_lts", required = true, status = "REQUIRED" },
                new StatusItem { id = "phase54_pre_editor_gate", required = true, status = "REQUIRED" },
                new StatusItem { id = "phase55_editor_validation", required = true, status = "REQUIRED" },
                new StatusItem { id = "playmode_compile", required = true, status = "PENDING_REAL_EDITOR" },
                new StatusItem { id = "final_3d_art_audio_vo", required = true, status = "CONTENT_IMPORT_REQUIRED" }
            };
        }
    }
}
