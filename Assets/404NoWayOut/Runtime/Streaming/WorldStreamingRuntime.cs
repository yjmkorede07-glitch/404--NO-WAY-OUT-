using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Streaming
{
    public class WorldStreamingRuntime : MonoBehaviour
    {
        [SerializeField] float activeRadius = 900f;
        [SerializeField] float hysteresis = 150f;
        readonly List<GameObject> streamedGroups = new List<GameObject>();
        public void Register(GameObject group) { if (group && !streamedGroups.Contains(group)) streamedGroups.Add(group); }
        public void Unregister(GameObject group) { streamedGroups.Remove(group); }
        void Update()
        {
            var target = Camera.main ? Camera.main.transform : transform;
            float outer = activeRadius + hysteresis;
            for (int i = streamedGroups.Count - 1; i >= 0; i--)
            {
                if (!streamedGroups[i]) { streamedGroups.RemoveAt(i); continue; }
                float d = Vector3.Distance(target.position, streamedGroups[i].transform.position);
                bool active = d <= outer;
                if (streamedGroups[i].activeSelf != active) streamedGroups[i].SetActive(active);
            }
        }
    }
}
