using Ardalis.Specification;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MahantInv.SharedKernel.Interfaces
{
    // from Ardalis.Specification
    public interface IAsyncRepository<T> : IReadOnlyRepository<T> where T : class, IAggregateRoot
    {
        Task<int> AddAsync(T entity, CancellationToken cancellationToken = default);
        Task<bool> UpdateAsync(T entity, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(T entity, CancellationToken cancellationToken = default);
        Task<bool> DeleteRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);
    }

    // generic methods approach option
    //public interface IRepository
    //{
    //    Task<T> GetByIdAsync<T>(int id) where T : BaseEntity, IAggregateRoot;
    //    Task<List<T>> ListAsync<T>() where T : BaseEntity, IAggregateRoot;
    //    Task<List<T>> ListAsync<T>(ISpecification<T> spec) where T : BaseEntity, IAggregateRoot;
    //    Task<T> AddAsync<T>(T entity) where T : BaseEntity, IAggregateRoot;
    //    Task UpdateAsync<T>(T entity) where T : BaseEntity, IAggregateRoot;
    //    Task DeleteAsync<T>(T entity) where T : BaseEntity, IAggregateRoot;
    //}
}