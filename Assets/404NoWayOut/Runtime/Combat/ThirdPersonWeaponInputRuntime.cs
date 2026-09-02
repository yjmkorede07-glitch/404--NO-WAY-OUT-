using UnityEngine;
using UnityEngine.InputSystem;

namespace NoWayOut.Combat
{
    public sealed class ThirdPersonWeaponInputRuntime : MonoBehaviour
    {
        [SerializeField] CombatRuntime combat;
        [SerializeField] Transform muzzle;
        [SerializeField] float fireRate = 8f;
        [SerializeField] float range = 120f;
        [SerializeField] float damage = 25f;
        float nextShot;
        public bool IsAiming { get; private set; }
        public bool IsFiring { get; private set; }

        void Update()
        {
            if (combat == null) combat = GetComponent<CombatRuntime>();
            var mouse = Mouse.current;
            if (mouse == null || combat == null) return;
            IsAiming = mouse.rightButton.isPressed;
            IsFiring = IsAiming && mouse.leftButton.isPressed;
            combat.SetAiming(IsAiming);
            if (IsFiring && Time.time >= nextShot)
            {
                nextShot = Time.time + 1f / Mathf.Max(0.1f, fireRate);
                combat.SetArmed(true);
                FireRay();
            }
        }

        void FireRay()
        {
            Camera cam = Camera.main;
            if (cam == null) return;
            Ray ray = new Ray(cam.transform.position, cam.transform.forward);
            if (Physics.Raycast(ray, out RaycastHit hit, range, ~0, QueryTriggerInteraction.Ignore))
            {
                var target = hit.collider.GetComponentInParent<CombatRuntime>();
                if (target != null && target != combat) target.ApplyDamage(damage);
            }
        }
    }
}
