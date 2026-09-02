using System;
using System.Collections.Generic;
using UnityEngine;

namespace NoWayOut.Online
{
    public enum ForceApplicationStatus { Pending, Accepted, Rejected, InterviewRequested, Suspended }

    [Serializable]
    public sealed class ForceApplication
    {
        public string applicationId;
        public string playerId;
        public string citizenId;
        public string submittedUtc;
        public string answersJson;
        public ForceApplicationStatus status;
        public string reviewedBy;
        public string reviewNote;
    }

    public sealed class ForceApplicationService : MonoBehaviour
    {
        private readonly List<ForceApplication> applications = new List<ForceApplication>();
        public IReadOnlyList<ForceApplication> Applications => applications;

        public ForceApplication Submit(string playerId, string citizenId, string answersJson)
        {
            var application = new ForceApplication
            {
                applicationId = Guid.NewGuid().ToString("N"),
                playerId = playerId,
                citizenId = citizenId,
                submittedUtc = DateTime.UtcNow.ToString("O"),
                answersJson = answersJson,
                status = ForceApplicationStatus.Pending
            };
            applications.Add(application);
            return application;
        }

        public bool Review(string applicationId, ForceApplicationStatus status, string adminId, string note)
        {
            var app = applications.Find(x => x.applicationId == applicationId);
            if (app == null) return false;
            if (status != ForceApplicationStatus.Accepted && status != ForceApplicationStatus.Rejected &&
                status != ForceApplicationStatus.InterviewRequested && status != ForceApplicationStatus.Suspended) return false;
            app.status = status;
            app.reviewedBy = adminId;
            app.reviewNote = note;
            return true;
        }
    }
}
