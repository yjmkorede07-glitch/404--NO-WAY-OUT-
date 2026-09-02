using System;
using UnityEngine;

namespace NoWayOut.Commerce
{
    public enum CommerceAction { Browse, Purchase, Sell, Deposit, Withdraw, Transfer, Repair, StartBusiness, UpgradeProperty, StartConstruction }
    public sealed class PhysicalCommerceRuntime : MonoBehaviour
    {
        public string LocationId { get; private set; }
        public bool RobberyActive { get; private set; }
        public event Action<CommerceAction> ActionCompleted;
        public event Action RobberyStarted;
        public event Action RobberyResolved;
        public void SetLocation(string id) => LocationId = id;
        public bool Perform(CommerceAction action) { if (string.IsNullOrWhiteSpace(LocationId)) return false; ActionCompleted?.Invoke(action); return true; }
        public bool StartRobbery() { if (string.IsNullOrWhiteSpace(LocationId) || RobberyActive) return false; RobberyActive = true; RobberyStarted?.Invoke(); return true; }
        public void ResolveRobbery() { if (!RobberyActive) return; RobberyActive = false; RobberyResolved?.Invoke(); }
    }
}
