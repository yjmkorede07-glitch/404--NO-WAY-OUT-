using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Missions
{
    public enum MissionState { Available, Briefing, OpeningCinematic, Active, Checkpoint, Failed, Completed, PostCinematic, FreeRoamReturn }
    [Serializable] public class MissionObjective { public string id; public string type; public string target; public bool optional; public bool completed; }
    [Serializable] public class MissionRuntimeDefinition { public string id; public string title; public List<MissionObjective> objectives = new(); public bool online; }

    public sealed class MissionRuntimeManager : MonoBehaviour
    {
        public MissionState State { get; private set; } = MissionState.Available;
        public MissionRuntimeDefinition Current { get; private set; }
        public event Action<MissionState> StateChanged;
        public event Action<MissionObjective> ObjectiveCompleted;

        public bool StartMission(MissionRuntimeDefinition mission)
        {
            if (mission == null || string.IsNullOrWhiteSpace(mission.id)) return false;
            Current = mission; SetState(MissionState.Briefing); SetState(MissionState.OpeningCinematic); SetState(MissionState.Active); return true;
        }
        public bool CompleteObjective(string objectiveId)
        {
            if (State != MissionState.Active || Current == null) return false;
            var o = Current.objectives.Find(x => x.id == objectiveId);
            if (o == null || o.completed) return false;
            o.completed = true; ObjectiveCompleted?.Invoke(o);
            if (Current.objectives.FindAll(x => !x.optional).TrueForAll(x => x.completed)) CompleteMission();
            else SetState(MissionState.Checkpoint);
            return true;
        }
        public void ResumeAfterCheckpoint() { if (Current != null) SetState(MissionState.Active); }
        public void FailMission() { if (Current != null) SetState(MissionState.Failed); }
        public void RestartFromCheckpoint() { if (Current != null) SetState(MissionState.Active); }
        public void CompleteMission() { SetState(MissionState.Completed); SetState(MissionState.PostCinematic); SetState(MissionState.FreeRoamReturn); }
        private void SetState(MissionState next) { State = next; StateChanged?.Invoke(next); }
    }
}
