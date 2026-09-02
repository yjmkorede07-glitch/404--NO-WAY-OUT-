using UnityEngine;
using UnityEngine.InputSystem;
using NoWayOut.Animation;

namespace NoWayOut.Player
{
    public enum LocomotionMode { Idle, Walk, Jog, Run, Sprint, Jump, Fall, AimWalk }

    [RequireComponent(typeof(CharacterController))]
    public sealed class GTAStyleLocomotionRuntime : MonoBehaviour
    {
        [SerializeField] float walkSpeed = 2.2f;
        [SerializeField] float jogSpeed = 4.2f;
        [SerializeField] float runSpeed = 6.2f;
        [SerializeField] float sprintSpeed = 8.2f;
        [SerializeField] float acceleration = 14f;
        [SerializeField] float deceleration = 18f;
        [SerializeField] float rotationSharpness = 14f;
        [SerializeField] float jumpHeight = 1.35f;
        [SerializeField] float gravity = -25f;
        [SerializeField] CharacterAnimationStateRuntime animationState;

        CharacterController controller;
        Vector3 planarVelocity;
        float verticalVelocity;
        public bool CanMove { get; set; } = true;
        public bool IsGrounded => controller != null && controller.isGrounded;
        public bool IsSprinting { get; private set; }
        public bool IsJumping { get; private set; }
        public LocomotionMode Mode { get; private set; } = LocomotionMode.Idle;

        void Awake() => controller = GetComponent<CharacterController>();

        void Update()
        {
            if (!CanMove) return;
            var kb = Keyboard.current;
            Vector2 input = Vector2.zero;
            if (kb != null)
            {
                if (kb.wKey.isPressed) input.y += 1;
                if (kb.sKey.isPressed) input.y -= 1;
                if (kb.aKey.isPressed) input.x -= 1;
                if (kb.dKey.isPressed) input.x += 1;
            }
            input = Vector2.ClampMagnitude(input, 1f);
            Vector3 direction = CameraRelative(input);
            bool aim = Mouse.current != null && Mouse.current.rightButton.isPressed;
            bool sprint = kb != null && kb.leftShiftKey.isPressed && input.y > 0.1f && !aim;
            bool jump = kb != null && kb.spaceKey.wasPressedThisFrame && controller.isGrounded && !aim;

            if (jump) { verticalVelocity = Mathf.Sqrt(jumpHeight * -2f * gravity); IsJumping = true; }
            if (controller.isGrounded && verticalVelocity < 0f) { verticalVelocity = -2f; IsJumping = false; }
            verticalVelocity += gravity * Time.deltaTime;

            float targetSpeed = SpeedFor(input, sprint, aim);
            Vector3 targetVelocity = direction * targetSpeed;
            float rate = targetVelocity.sqrMagnitude > planarVelocity.sqrMagnitude ? acceleration : deceleration;
            planarVelocity = Vector3.MoveTowards(planarVelocity, targetVelocity, rate * Time.deltaTime);
            controller.Move((planarVelocity + Vector3.up * verticalVelocity) * Time.deltaTime);

            if (direction.sqrMagnitude > .001f)
            {
                Quaternion targetRotation = Quaternion.LookRotation(direction);
                transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, rotationSharpness * Time.deltaTime);
            }
            UpdateState(input, sprint, aim);
        }

        Vector3 CameraRelative(Vector2 input)
        {
            Vector3 direction = new Vector3(input.x, 0f, input.y);
            Camera cam = Camera.main;
            if (cam == null) return direction;
            Vector3 f = cam.transform.forward; f.y = 0; f.Normalize();
            Vector3 r = cam.transform.right; r.y = 0; r.Normalize();
            return Vector3.ClampMagnitude(f * input.y + r * input.x, 1f);
        }

        float SpeedFor(Vector2 input, bool sprint, bool aim)
        {
            if (input.sqrMagnitude < .001f) { IsSprinting = false; return 0f; }
            if (aim) { IsSprinting = false; return walkSpeed; }
            if (sprint) { IsSprinting = true; return sprintSpeed; }
            IsSprinting = false;
            // Forward movement progresses through jog/run with a clean GTA-style sprint layer.
            return input.magnitude < .55f ? walkSpeed : (input.magnitude < .9f ? jogSpeed : runSpeed);
        }

        void UpdateState(Vector2 input, bool sprint, bool aim)
        {
            if (!controller.isGrounded) Mode = verticalVelocity > 0 ? LocomotionMode.Jump : LocomotionMode.Fall;
            else if (input.sqrMagnitude < .001f) Mode = LocomotionMode.Idle;
            else if (aim) Mode = LocomotionMode.AimWalk;
            else if (sprint) Mode = LocomotionMode.Sprint;
            else if (input.magnitude < .55f) Mode = LocomotionMode.Walk;
            else if (input.magnitude < .9f) Mode = LocomotionMode.Jog;
            else Mode = LocomotionMode.Run;
            if (animationState != null)
            {
                CharacterAnimationState state = Mode switch
                {
                    LocomotionMode.Idle => CharacterAnimationState.Idle,
                    LocomotionMode.Walk => CharacterAnimationState.Walk,
                    LocomotionMode.Jog => CharacterAnimationState.Run,
                    LocomotionMode.Run => CharacterAnimationState.Run,
                    LocomotionMode.Sprint => CharacterAnimationState.Sprint,
                    LocomotionMode.Jump => CharacterAnimationState.Jump,
                    LocomotionMode.Fall => CharacterAnimationState.Jump,
                    LocomotionMode.AimWalk => CharacterAnimationState.Aim,
                    _ => CharacterAnimationState.Idle
                };
                animationState.SetState(state);
                animationState.SetFloat("NWO_Speed", planarVelocity.magnitude);
                animationState.SetBool("NWO_Grounded", controller.isGrounded);
            }
        }
    }
}
