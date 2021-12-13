using Ardalis.GuardClauses;
using Ardalis.Result;
using MahantInv.Core.Interfaces;
using MahantInv.Core.ProjectAggregate;
using MahantInv.Core.ProjectAggregate.Specifications;
using MahantInv.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MahantInv.Core.Services
{
    public class ToDoItemSearchService : IToDoItemSearchService
    {
        private readonly IAsyncRepository<Project> _repository;

        public ToDoItemSearchService(IAsyncRepository<Project> repository)
        {
            _repository = repository;
        }

        public async Task<Result<List<ToDoItem>>> GetAllIncompleteItemsAsync(int projectId, string searchString)
        {
            //if (string.IsNullOrEmpty(searchString))
            //{
            //    List<ValidationError> errors = new()
            //    {
            //        new ValidationError()
            //        {
            //            Identifier = nameof(searchString),
            //            ErrorMessage = $"{nameof(searchString)} is required."
            //        }
            //    };
            //    return Result<List<ToDoItem>>.Invalid(errors);
            //}

            //var projectSpec = new ProjectByIdWithItemsSpec(projectId);
            //var project = await _repository.GetBySpecAsync(projectSpec);

            //// TODO: Optionally use Ardalis.GuardClauses Guard.Against.NotFound and catch
            //if (project == null) return Result<List<ToDoItem>>.NotFound();

            //var incompleteSpec = new IncompleteItemsSearchSpec(searchString);

            //try
            //{
            //    var items = incompleteSpec.Evaluate(project.Items).ToList();

            //    return new Result<List<ToDoItem>>(items);
            //}
            //catch (Exception ex)
            //{
            //    // TODO: Log details here
            //    return Result<List<ToDoItem>>.Error(new[] { ex.Message });
            //}
            throw new NotImplementedException();
        }

        public async Task<Result<ToDoItem>> GetNextIncompleteItemAsync(int projectId)
        {
            //var projectSpec = new ProjectByIdWithItemsSpec(projectId);
            //var project = await _repository.GetBySpecAsync(projectSpec);

            //var incompleteSpec = new IncompleteItemsSpec();

            //var items = incompleteSpec.Evaluate(project.Items).ToList();

            //if (!items.Any())
            //{
            //    return Result<ToDoItem>.NotFound();
            //}

            //return new Result<ToDoItem>(items.First());
            throw new NotImplementedException();
        }
    }
}
