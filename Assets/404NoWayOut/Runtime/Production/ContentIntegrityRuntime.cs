using System;
using UnityEngine;

namespace NoWayOut.Production
{
    [Serializable]
    public struct ContentIntegrityStatus
    {
        public int missionCount;
        public int expectedMissionCount;
        public int endingCount;
        public int expectedEndingCount;
        public bool campaignReady;
        public bool artReady;
        public bool audioReady;
        public bool networkReady;
    }

    public sealed class ContentIntegrityRuntime : MonoBehaviour
    {
        [SerializeField] int expectedMissionCount = 88;
        [SerializeField] int expectedEndingCount = 4;
        public ContentIntegrityStatus Status { get; private set; }

        public void SetStatus(int missionCount, int endingCount, bool artReady, bool audioReady, bool networkReady)
        {
            Status = new ContentIntegrityStatus
            {
                missionCount = missionCount,
                expectedMissionCount = expectedMissionCount,
                endingCount = endingCount,
                expectedEndingCount = expectedEndingCount,
                campaignReady = missionCount == expectedMissionCount && endingCount == expectedEndingCount,
                artReady = artReady,
                audioReady = audioReady,
                networkReady = networkReady
            };
        }
    }
}
