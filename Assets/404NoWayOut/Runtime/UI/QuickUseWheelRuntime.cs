using System;
using UnityEngine;
using UnityEngine.InputSystem;
using NoWayOut.Health;

namespace NoWayOut.UI
{
    public enum WheelCategory { Weapon, Medical, Food, Utility }
    public sealed class QuickUseWheelRuntime : MonoBehaviour
    {
        [SerializeField] HealthRecoveryRuntime recovery;
        [SerializeField] bool opened;
        public bool IsOpen => opened;
        public WheelCategory SelectedCategory { get; private set; } = WheelCategory.Weapon;
        public event Action<bool> WheelToggled;
        void Update()
        {
            if(Keyboard.current==null)return;
            if(Keyboard.current.tabKey.wasPressedThisFrame){opened=!opened;WheelToggled?.Invoke(opened);}
            if(!opened)return;
            if(Keyboard.current.digit1Key.wasPressedThisFrame)SelectedCategory=WheelCategory.Weapon;
            if(Keyboard.current.digit2Key.wasPressedThisFrame)SelectedCategory=WheelCategory.Medical;
            if(Keyboard.current.digit3Key.wasPressedThisFrame)SelectedCategory=WheelCategory.Food;
            if(Keyboard.current.digit4Key.wasPressedThisFrame)SelectedCategory=WheelCategory.Utility;
            if(Keyboard.current.enterKey.wasPressedThisFrame && recovery){ if(SelectedCategory==WheelCategory.Medical)recovery.Use("bandage"); else if(SelectedCategory==WheelCategory.Food)recovery.Use("snack"); }
        }
    }
}
