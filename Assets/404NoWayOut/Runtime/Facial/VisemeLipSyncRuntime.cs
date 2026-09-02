using System;
using UnityEngine;

namespace NoWayOut.Facial
{
    public enum Viseme { Silence, PP, FF, TH, DD, KK, CH, SS, NN, RR, AA, E, I, O, U }
    [Serializable] public struct VisemeKey { public float time; public Viseme viseme; [Range(0f,1f)] public float weight; }
    public sealed class VisemeLipSyncRuntime : MonoBehaviour
    {
        [SerializeField] FacialExpressionRuntime facial;
        public void Apply(VisemeKey key)
        {
            if (facial == null) return;
            facial.SetChannel("Viseme_" + key.viseme, key.weight);
        }
        public void ApplySilence() => Apply(new VisemeKey { viseme=Viseme.Silence, weight=1f });
    }
}
