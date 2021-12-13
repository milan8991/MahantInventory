using Ardalis.Specification;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MahantInv.SharedKernel.Interfaces
{
    public interface IReadOnlyRepository<T> where T : class
    {
        Task<T> GetByIdAsync(object id, CancellationToken cancellationToken = default);
        Task<int> CountAsync(CancellationToken cancellationToken = default);
        Task<IEnumerable<T>> ListRangeAsync(IEnumerable<object> ids, CancellationToken cancellationToken = default);
        Task<IEnumerable<T>> ListAllAsync(CancellationToken cancellationToken = default);
        Task<IEnumerable<T>> ListAllAsync(bool isActive, CancellationToken cancellationToken = default);
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