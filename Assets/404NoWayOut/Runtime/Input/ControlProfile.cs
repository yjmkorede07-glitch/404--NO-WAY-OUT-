using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Inputs
{
    [Serializable]
    public sealed class ControlBinding
    {
        public string actionId;
        public string displayName;
        public string keyboardKey;
        public string mouseButton;
        public string notes;
    }

    [CreateAssetMenu(menuName = "404/Controls/Control Profile")]
    public sealed class ControlProfile : ScriptableObject
    {
        public List<ControlBinding> bindings = new List<ControlBinding>();

        public ControlBinding Find(string actionId) => bindings.Find(x => x.actionId == actionId);
    }
}
