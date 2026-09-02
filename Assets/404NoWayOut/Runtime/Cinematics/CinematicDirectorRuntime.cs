using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Cinematics
{
    [Serializable] public class ShotDefinition { public string id; public float duration; public string cameraId; public string actor; public string animation; public string facialExpression; public string dialogueKey; }
    [Serializable] public class CinematicSequence { public string id; public string missionId; public CinematicStage stage; public List<ShotDefinition> shots = new(); }
    public sealed class CinematicDirectorRuntime : MonoBehaviour
    {
        public bool IsPlaying { get; private set; }
        public CinematicSequence Current { get; private set; }
        public int CurrentShotIndex { get; private set; } = -1;
        public event Action<CinematicSequence> Started, Finished;
        public void Play(CinematicSequence sequence) { if (sequence == null) return; Current=sequence; CurrentShotIndex=-1; IsPlaying=true; Started?.Invoke(sequence); Advance(); }
        public void Advance() { if (!IsPlaying || Current == null) return; CurrentShotIndex++; if (CurrentShotIndex >= Current.shots.Count) Finish(); }
        public void Finish() { if (!IsPlaying) return; IsPlaying=false; var done=Current; Current=null; CurrentShotIndex=-1; Finished?.Invoke(done); }
        public void Skip() => Finish();
    }
}
