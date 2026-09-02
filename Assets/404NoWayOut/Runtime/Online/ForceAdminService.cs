using System;
using UnityEngine;

namespace NoWayOut.Online
{
    public sealed class ForceAdminService : MonoBehaviour
    {
        public bool CanReview(ForceApplication application, string adminId)
        {
            return application != null && !string.IsNullOrWhiteSpace(adminId);
        }

        public bool ApplyDecision(ForceApplicationService applications, OnlineWorldRuntime world, string applicationId, ForceApplicationStatus status, string adminId, string note, ForceRank rank)
        {
            if (applications == null || world == null || string.IsNullOrWhiteSpace(adminId)) return false;
            if (!applications.Review(applicationId, status, adminId, note)) return false;
            if (status == ForceApplicationStatus.Accepted)
            {
                var app = applications.Applications;
                for (int i = 0; i < app.Count; i++)
                    if (app[i].applicationId == applicationId) return world.SetForceAcceptance(app[i].playerId, true, rank);
            }
            return true;
        }
    }
}
