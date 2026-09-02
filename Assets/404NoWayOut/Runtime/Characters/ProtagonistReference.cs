using UnityEngine;

namespace NoWayOut.Characters
{
    public enum ProtagonistId { DariusCole, MalikReed, AmaraVale }

    [CreateAssetMenu(menuName = "404/Characters/Protagonist Reference")]
    public sealed class ProtagonistReference : ScriptableObject
    {
        public ProtagonistId protagonist;
        public string canonicalName;
        [TextArea] public string visualReferenceNotes;
        [TextArea] public string voiceReferenceNotes;
        public Texture2D referenceImage;
        public bool finalImageRightsCleared;
        public bool voiceRightsCleared;
    }
}
