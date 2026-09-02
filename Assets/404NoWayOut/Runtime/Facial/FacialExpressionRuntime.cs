using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Facial
{
    public enum FacialExpression { Neutral, Happy, Sad, Angry, Fear, Surprise, Disgust, Focused, Smirk, Pain, Determined }
    [Serializable] public struct FacialChannel { public string name; [Range(0f,1f)] public float weight; }
    public sealed class FacialExpressionRuntime : MonoBehaviour
    {
        [SerializeField] SkinnedMeshRenderer faceRenderer;
        readonly Dictionary<string,float> weights = new(StringComparer.OrdinalIgnoreCase);
        public FacialExpression Current { get; private set; } = FacialExpression.Neutral;
        public void SetExpression(FacialExpression expression, float intensity = 1f)
        {
            Current = expression; ApplyPreset(expression, Mathf.Clamp01(intensity));
        }
        public void SetChannel(string channel, float weight)
        {
            weights[channel] = Mathf.Clamp01(weight);
            if (faceRenderer == null) return;
            for (int i=0;i<faceRenderer.sharedMesh.blendShapeCount;i++)
                if (string.Equals(faceRenderer.sharedMesh.GetBlendShapeName(i), channel, StringComparison.OrdinalIgnoreCase))
                    faceRenderer.SetBlendShapeWeight(i, Mathf.Clamp01(weight)*100f);
        }
        void ApplyPreset(FacialExpression e, float v)
        {
            switch(e)
            {
                case FacialExpression.Happy: SetChannel("Mouth_Smile",v); SetChannel("Cheek_Raise",v); break;
                case FacialExpression.Sad: SetChannel("Brow_Inner_Up",v); SetChannel("Mouth_Frown",v); break;
                case FacialExpression.Angry: SetChannel("Brow_Down",v); SetChannel("Jaw_Tight",v); break;
                case FacialExpression.Fear: SetChannel("Eye_Wide",v); SetChannel("Brow_Inner_Up",v); break;
                case FacialExpression.Surprise: SetChannel("Eye_Wide",v); SetChannel("Jaw_Open",v); break;
                case FacialExpression.Disgust: SetChannel("Nose_Wrinkle",v); SetChannel("Upper_Lip_Raise",v); break;
                case FacialExpression.Focused: SetChannel("Brow_Down",v*.5f); SetChannel("Jaw_Tight",v*.35f); break;
                case FacialExpression.Smirk: SetChannel("Mouth_Smile_R",v); break;
                case FacialExpression.Pain: SetChannel("Brow_Inner_Up",v); SetChannel("Jaw_Open",v*.5f); break;
                case FacialExpression.Determined: SetChannel("Brow_Down",v*.35f); SetChannel("Jaw_Tight",v*.5f); break;
            }
        }
    }
}
