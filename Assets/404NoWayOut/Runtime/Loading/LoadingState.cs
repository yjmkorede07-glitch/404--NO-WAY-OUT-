using UnityEngine;

namespace NoWayOut.Loading
{
    public enum LoadingState
    {
        Hidden, Booting, Profile, World, District, Interior, Mission,
        Cinematic, OnlineConnect, OnlineReconnect, ReturnToWorld
    }

    public sealed class LoadingStateController : MonoBehaviour
    {
        public LoadingState CurrentState { get; private set; } = LoadingState.Hidden;
        public string Context { get; private set; } = string.Empty;

        public void Show(LoadingState state, string context = "")
        {
            CurrentState = state;
            Context = context;
            gameObject.SetActive(state != LoadingState.Hidden);
        }

        public void Hide() => Show(LoadingState.Hidden);
    }
}
