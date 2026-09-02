using System;
using UnityEngine;
using NoWayOut.Combat;
using NoWayOut.Inventory;

namespace NoWayOut.Health
{
    public enum RecoveryItemKind { Snack, Bandage, MedicalKit }
    [Serializable] public sealed class RecoveryItemDefinition { public string itemId; public RecoveryItemKind kind; public float health; public float useSeconds; public int maxStack; }
    public sealed class HealthRecoveryRuntime : MonoBehaviour
    {
        [SerializeField] CombatRuntime combat;
        [SerializeField] BackpackInventoryRuntime backpack;
        [SerializeField] RecoveryItemDefinition[] items = {
            new RecoveryItemDefinition{itemId="snack",kind=RecoveryItemKind.Snack,health=10,useSeconds=0.8f,maxStack=5},
            new RecoveryItemDefinition{itemId="bandage",kind=RecoveryItemKind.Bandage,health=30,useSeconds=2.2f,maxStack=5},
            new RecoveryItemDefinition{itemId="medical_kit",kind=RecoveryItemKind.MedicalKit,health=60,useSeconds=4f,maxStack=2}
        };
        public event Action<string,float> Recovered;
        void Awake(){if(!combat)combat=GetComponent<CombatRuntime>();if(!backpack)backpack=GetComponent<BackpackInventoryRuntime>();}
        public bool CanUse(string itemId){var d=Find(itemId);return d!=null&&combat!=null&&backpack!=null&&combat.State!=CombatState.Dead&&combat.State!=CombatState.Downed&&combat.Health<combat.MaxHealth&&backpack.Count(itemId)>0;}
        public bool Use(string itemId){var d=Find(itemId);if(!CanUse(itemId))return false;if(!backpack.Remove(itemId,1))return false;combat.Restore(Mathf.Min(combat.MaxHealth,combat.Health+d.health),combat.Armor);Recovered?.Invoke(itemId,d.health);return true;}
        RecoveryItemDefinition Find(string id){foreach(var d in items)if(d.itemId==id)return d;return null;}
    }
}
