using MahantInv.Core.ProjectAggregate;
using System.Collections.Generic;

namespace MahantInv.Web.Endpoints.ProjectEndpoints
{
    public class ProjectListResponse
    {
        public List<ProjectRecord> Projects { get; set; } = new();
    }
}
