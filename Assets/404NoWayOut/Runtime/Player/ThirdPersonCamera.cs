using UnityEngine;
using UnityEngine.InputSystem;

namespace NoWayOut.Player
{
    public sealed class ThirdPersonCamera : MonoBehaviour
    {
        [SerializeField] private Transform target;
        [SerializeField] private Vector3 offset = new Vector3(0f, 3.2f, -6.5f);
        [SerializeField] private float followSpeed = 12f;
        [SerializeField] private float lookSpeed = 0.12f;
        [SerializeField] private float minPitch = -25f;
        [SerializeField] private float maxPitch = 55f;
        private float yaw;
        private float pitch = 12f;

        public void SetTarget(Transform value) { target = value; if (value != null) yaw = value.eulerAngles.y; }

        private void LateUpdate()
        {
            if (target == null) return;
            var mouse = Mouse.current;
            if (mouse != null && Cursor.lockState == CursorLockMode.Locked)
            {
                Vector2 delta = mouse.delta.ReadValue();
                yaw += delta.x * lookSpeed;
                pitch = Mathf.Clamp(pitch - delta.y * lookSpeed, minPitch, maxPitch);
            }
            Quaternion orbit = Quaternion.Euler(pitch, yaw, 0f);
            Vector3 desired = target.position + orbit * offset;
            transform.position = Vector3.Lerp(transform.position, desired, 1f - Mathf.Exp(-followSpeed * Time.deltaTime));
            transform.LookAt(target.position + Vector3.up * 1.4f);
            if (Keyboard.current != null && Keyboard.current.escapeKey.wasPressedThisFrame) Cursor.lockState = CursorLockMode.None;
            if (Mouse.current != null && Mouse.current.leftButton.wasPressedThisFrame) Cursor.lockState = CursorLockMode.Locked;
        }
    }
}
