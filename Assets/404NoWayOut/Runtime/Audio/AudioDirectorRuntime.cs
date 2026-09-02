using UnityEngine;
using NoWayOut.Settings;

namespace NoWayOut.Audio
{
    public class AudioDirectorRuntime : MonoBehaviour
    {
        public static AudioDirectorRuntime Instance { get; private set; }
        [SerializeField] AudioSource musicSource, effectsSource, dialogueSource;
        void Awake() { if (Instance != null && Instance != this) { Destroy(gameObject); return; } Instance = this; DontDestroyOnLoad(gameObject); }
        public void PlayMusic(AudioClip clip, bool loop = true) { if (!musicSource) return; musicSource.loop = loop; musicSource.clip = clip; musicSource.volume = SettingsRuntime.Instance ? SettingsRuntime.Instance.Data.musicVolume : .8f; musicSource.Play(); }
        public void PlayEffect(AudioClip clip) { if (!effectsSource || !clip) return; effectsSource.volume = SettingsRuntime.Instance ? SettingsRuntime.Instance.Data.effectsVolume : 1f; effectsSource.PlayOneShot(clip); }
        public void PlayDialogue(AudioClip clip) { if (!dialogueSource || !clip) return; dialogueSource.volume = SettingsRuntime.Instance ? SettingsRuntime.Instance.Data.dialogueVolume : 1f; dialogueSource.PlayOneShot(clip); }
    }
}
