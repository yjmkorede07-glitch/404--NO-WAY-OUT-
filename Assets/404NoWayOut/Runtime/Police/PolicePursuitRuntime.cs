using System;
using UnityEngine;

namespace NoWayOut.Police
{
    public enum PursuitState { Investigating, Searching, Pursuing, Containment, ArrestAttempt, LostContact }
    public sealed class PolicePursuitRuntime : MonoBehaviour
    {
        public int WantedStars { get; private set; }
        public PursuitState State { get; private set; } = PursuitState.Investigating;
        public bool IsFugitive { get; private set; }
        public event Action<int> WantedChanged;
        public event Action<PursuitState> PursuitChanged;
        public void SetWantedStars(int stars) { WantedStars = Mathf.Clamp(stars, 0, 5); WantedChanged?.Invoke(WantedStars); State = WantedStars > 0 ? PursuitState.Searching : PursuitState.LostContact; PursuitChanged?.Invoke(State); }
        public void SetPursuit(PursuitState state) { State = state; PursuitChanged?.Invoke(state); }
        public void BeginFugitive() { IsFugitive = true; SetWantedStars(0); }
        public void ClearFugitive() { IsFugitive = false; SetWantedStars(0); }
        public bool CanAttemptArrest() => WantedStars > 0 && State == PursuitState.ArrestAttempt;
    }
}
