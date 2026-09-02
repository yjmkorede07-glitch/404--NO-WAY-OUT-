using UnityEngine;
using UnityEngine.InputSystem;

namespace NoWayOut.Player
{
    [RequireComponent(typeof(CharacterController))]
    public sealed class ThirdPersonPlayerController : MonoBehaviour
    {
        [SerializeField] private float moveSpeed = 5.5f;
        [SerializeField] private float sprintSpeed = 8f;
        [SerializeField] private float rotationSpeed = 12f;
        [SerializeField] private float gravity = -22f;
        private CharacterController controller;
        private float verticalVelocity;
        public bool CanMove { get; set; } = true;

        private void Awake() => controller = GetComponent<CharacterController>();

        private void Update()
        {
            if (!CanMove) return;
            var kb = Keyboard.current;
            var move = Vector2.zero;
            if (kb != null)
            {
                if (kb.wKey.isPressed) move.y += 1f;
                if (kb.sKey.isPressed) move.y -= 1f;
                if (kb.aKey.isPressed) move.x -= 1f;
                if (kb.dKey.isPressed) move.x += 1f;
            }
            move = Vector2.ClampMagnitude(move, 1f);
            Vector3 direction = new Vector3(move.x, 0f, move.y);
            var camera = Camera.main;
            if (camera != null)
            {
                Vector3 forward = camera.transform.forward; forward.y = 0f; forward.Normalize();
                Vector3 right = camera.transform.right; right.y = 0f; right.Normalize();
                direction = (forward * move.y) + (right * move.x);
            }
            float speed = kb != null && kb.leftShiftKey.isPressed ? sprintSpeed : moveSpeed;
            controller.Move(direction * speed * Time.deltaTime);
            if (direction.sqrMagnitude > 0.001f)
                transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(direction), rotationSpeed * Time.deltaTime);
            if (controller.isGrounded && verticalVelocity < 0f) verticalVelocity = -2f;
            verticalVelocity += gravity * Time.deltaTime;
            controller.Move(Vector3.up * verticalVelocity * Time.deltaTime);
        }
    }
}
