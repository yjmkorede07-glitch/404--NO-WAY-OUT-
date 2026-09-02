using System;
using UnityEngine;

namespace NoWayOut.Combat
{
    public enum CombatState { Unarmed, Armed, Aiming, Firing, Reloading, Stunned, Downed, Dead }
    public sealed class CombatRuntime : MonoBehaviour
    {
        [SerializeField] float maxHealth = 100f;
        [SerializeField] float maxArmor = 100f;
        public float Health { get; private set; }
        public float MaxHealth => maxHealth;
        public float MaxArmor => maxArmor;
        public float Armor { get; private set; }
        public CombatState State { get; private set; } = CombatState.Unarmed;
        public event Action<float> Damaged;
        public event Action Downed;
        public event Action Died;
        void Awake() { Health = maxHealth; Armor = 0f; }
        public void SetArmed(bool armed) => State = armed ? CombatState.Armed : CombatState.Unarmed;
        public void SetAiming(bool aiming) { if (State != CombatState.Downed && State != CombatState.Dead) State = aiming ? CombatState.Aiming : (State == CombatState.Aiming ? CombatState.Armed : State); }
        public void ApplyDamage(float amount, bool armorFirst = true)
        {
            if (amount <= 0 || State == CombatState.Dead) return;
            float absorbed = armorFirst ? Mathf.Min(Armor, amount) : 0f; Armor -= absorbed; float healthDamage = amount - absorbed; Health = Mathf.Max(0, Health - healthDamage); Damaged?.Invoke(healthDamage);
            if (Health <= 0) { State = CombatState.Dead; Died?.Invoke(); } else if (Health <= maxHealth * .2f) { State = CombatState.Downed; Downed?.Invoke(); }
        }
        public void Restore(float health, float armor = 0) { Health = Mathf.Clamp(health, 0, maxHealth); Armor = Mathf.Clamp(armor, 0, maxArmor); if (Health > 0) State = CombatState.Unarmed; }
    }
}
