using System;
using UnityEngine;

namespace NoWayOut.Animation
{
    public enum CharacterAnimationState { Idle, Walk, Run, Sprint, Jump, Aim, Fire, Reload, Melee, Injured, Downed, VehicleEnter, VehicleExit, Drive, Swim, Climb, Talk, Cinematic }
    public sealed class CharacterAnimationStateRuntime : MonoBehaviour
    {
        [SerializeField] Animator animator;
        public CharacterAnimationState State { get; private set; } = CharacterAnimationState.Idle;
        public void SetState(CharacterAnimationState state)
        {
            State = state;
            if (animator == null) return;
            animator.SetInteger("NWO_State", (int)state);
            animator.SetTrigger("NWO_Refresh");
        }
        public void SetFloat(string parameter, float value) { if (animator != null) animator.SetFloat(parameter, value); }
        public void SetBool(string parameter, bool value) { if (animator != null) animator.SetBool(parameter, value); }
    }
}
