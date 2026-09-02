using System;
using UnityEngine;

namespace NoWayOut.Settings
{
    [Serializable] public class GameSettingsData
    {
        public float masterVolume = 1f, musicVolume = .8f, effectsVolume = 1f, dialogueVolume = 1f;
        public bool subtitles = true, reduceMotion = false, highContrast = false, vibration = true;
        public int targetFrameRate = 60;
    }

    public class SettingsRuntime : MonoBehaviour
    {
        public static SettingsRuntime Instance { get; private set; }
        public GameSettingsData Data { get; private set; } = new GameSettingsData();
        public event Action Changed;
        void Awake() { if (Instance != null && Instance != this) { Destroy(gameObject); return; } Instance = this; DontDestroyOnLoad(gameObject); Load(); }
        public void Load()
        {
            Data.masterVolume = PlayerPrefs.GetFloat("nwo.master", 1f); Data.musicVolume = PlayerPrefs.GetFloat("nwo.music", .8f); Data.effectsVolume = PlayerPrefs.GetFloat("nwo.fx", 1f); Data.dialogueVolume = PlayerPrefs.GetFloat("nwo.vo", 1f);
            Data.subtitles = PlayerPrefs.GetInt("nwo.subtitles", 1) == 1; Data.reduceMotion = PlayerPrefs.GetInt("nwo.reduceMotion", 0) == 1; Data.highContrast = PlayerPrefs.GetInt("nwo.highContrast", 0) == 1; Data.vibration = PlayerPrefs.GetInt("nwo.vibration", 1) == 1; Data.targetFrameRate = PlayerPrefs.GetInt("nwo.fps", 60); Application.targetFrameRate = Data.targetFrameRate; Changed?.Invoke();
        }
        public void Save() { PlayerPrefs.SetFloat("nwo.master", Data.masterVolume); PlayerPrefs.SetFloat("nwo.music", Data.musicVolume); PlayerPrefs.SetFloat("nwo.fx", Data.effectsVolume); PlayerPrefs.SetFloat("nwo.vo", Data.dialogueVolume); PlayerPrefs.SetInt("nwo.subtitles", Data.subtitles ? 1 : 0); PlayerPrefs.SetInt("nwo.reduceMotion", Data.reduceMotion ? 1 : 0); PlayerPrefs.SetInt("nwo.highContrast", Data.highContrast ? 1 : 0); PlayerPrefs.SetInt("nwo.vibration", Data.vibration ? 1 : 0); PlayerPrefs.SetInt("nwo.fps", Data.targetFrameRate); PlayerPrefs.Save(); Changed?.Invoke(); }
    }
}
