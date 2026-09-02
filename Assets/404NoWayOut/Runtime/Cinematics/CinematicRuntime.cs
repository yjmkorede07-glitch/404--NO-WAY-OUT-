using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Cinematics
{
    public enum CinematicStage { Opening, InMission, PostMission, Ending, Loading }
    [Serializable] public class CinematicCue { public string id; public float durationSeconds; public string camera; public string dialogueKey; public string animationKey; }
    [Serializable] public class CinematicDefinition { public string id; public string missionId; public CinematicStage stage; public List<CinematicCue> cues = new(); }
    public sealed class CinematicRuntime : MonoBehaviour
    {
        public bool IsPlaying { get; private set; }
        public CinematicDefinition Current { get; private set; }
        public event Action<CinematicDefinition> Started, Finished;
        public void Play(CinematicDefinition definition) { Current = definition; IsPlaying = true; Started?.Invoke(definition); }
        public void Finish() { if (!IsPlaying) return; IsPlaying = false; Finished?.Invoke(Current); Current = null; }
        public void SkipToEnd() => Finish();
    }
}
