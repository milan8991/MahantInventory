using Ardalis.Specification;
using MahantInv.Core.ProjectAggregate;

namespace MahantInv.Core.ProjectAggregate.Specifications
{
    public class ProjectByIdWithItemsSpec : Specification<Project>, ISingleResultSpecification
    {
        public ProjectByIdWithItemsSpec(int projectId)
        {
            Query
                .Where(project => project.Id == projectId)
                .Include(project => project.Items);
        }
    }
}
