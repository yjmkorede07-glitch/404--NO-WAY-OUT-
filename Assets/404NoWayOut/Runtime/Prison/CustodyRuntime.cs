using System;
using UnityEngine;

namespace NoWayOut.Prison
{
    public enum CustodyState { Free, Wanted, Arrested, Transported, Booked, Incarcerated, Released, Escaped, Fugitive }
    public class CustodyRuntime : MonoBehaviour
    {
        public CustodyState State { get; private set; } = CustodyState.Free;
        public int WantedStars { get; private set; }
        public double FugitiveUntilGameMinutes { get; private set; }
        public event Action<CustodyState> StateChanged;
        public void SetWanted(int stars) { WantedStars = Mathf.Clamp(stars, 0, 5); State = WantedStars == 0 ? CustodyState.Free : CustodyState.Wanted; StateChanged?.Invoke(State); }
        public void Arrest() { State = CustodyState.Arrested; StateChanged?.Invoke(State); }
        public bool CanBail => State == CustodyState.Booked && WantedStars <= 3;
        public bool PayBail() { if (!CanBail) return false; State = CustodyState.Released; WantedStars = 0; StateChanged?.Invoke(State); return true; }
        public void Book(bool prisonTransfer) { State = prisonTransfer ? CustodyState.Incarcerated : CustodyState.Booked; StateChanged?.Invoke(State); }
        public bool AttemptEscape() { if (State != CustodyState.Incarcerated && State != CustodyState.Booked) return false; State = CustodyState.Escaped; StateChanged?.Invoke(State); return true; }
        public void EnterFugitivePeriod(double currentGameMinutes) { State = CustodyState.Fugitive; FugitiveUntilGameMinutes = currentGameMinutes + 14400.0; StateChanged?.Invoke(State); }
        public void Tick(double currentGameMinutes) { if (State == CustodyState.Fugitive && currentGameMinutes >= FugitiveUntilGameMinutes) { State = CustodyState.Free; WantedStars = 0; StateChanged?.Invoke(State); } }
    }
}
