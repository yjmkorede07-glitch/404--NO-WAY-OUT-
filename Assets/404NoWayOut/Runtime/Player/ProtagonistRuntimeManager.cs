using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;
using NoWayOut.Characters;

namespace NoWayOut.Player
{
    public sealed class ProtagonistRuntimeManager : MonoBehaviour
    {
        [SerializeField] private List<GameObject> protagonists = new List<GameObject>();
        [SerializeField] private ThirdPersonCamera cameraRig;
        private int activeIndex;
        public GameObject ActiveProtagonist => protagonists.Count == 0 ? null : protagonists[activeIndex];

        public void Register(GameObject protagonist) { if (protagonist != null && !protagonists.Contains(protagonist)) protagonists.Add(protagonist); }

        public void SwitchTo(int index)
        {
            if (index < 0 || index >= protagonists.Count) return;
            for (int i = 0; i < protagonists.Count; i++) protagonists[i].SetActive(i == index);
            activeIndex = index;
            if (cameraRig != null) cameraRig.SetTarget(protagonists[index].transform);
        }

        private void Update()
        {
            var kb = Keyboard.current;
            if (kb == null || protagonists.Count < 2) return;
            if (kb.digit1Key.wasPressedThisFrame) SwitchTo(0);
            if (kb.digit2Key.wasPressedThisFrame) SwitchTo(1);
            if (kb.digit3Key.wasPressedThisFrame) SwitchTo(2);
        }
    }
}
