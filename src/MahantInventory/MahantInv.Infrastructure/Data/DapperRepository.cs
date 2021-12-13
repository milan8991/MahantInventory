using Ardalis.Specification.EntityFrameworkCore;
using MahantInv.SharedKernel.Interfaces;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using Dapper.Contrib.Extensions;

namespace MahantInv.Infrastructure.Data
{
    // inherit from Ardalis.Specification type
    public class DapperRepository<T> : BaseRepository, IReadOnlyRepository<T>, IAsyncRepository<T> where T : class, IAggregateRoot
    {
        public DapperRepository(IDapperUnitOfWork uow) : base(uow) { }

        public virtual Task<int> AddAsync(T entity, CancellationToken cancellationToken = default)
        {
            return db.InsertAsync<T>(entity, transaction: t);
        }

        public virtual Task<bool> UpdateAsync(T entity, CancellationToken cancellationToken = default)
        {
            return db.UpdateAsync<T>(entity, transaction: t);
        }

        public virtual Task<bool> DeleteAsync(T entity, CancellationToken cancellationToken = default)
        {
            return db.DeleteAsync<T>(entity, transaction: t);
        }

        public virtual async Task<bool> DeleteRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
        {
            var result = true;

            foreach (var entity in entities)
            {
                result = result && await this.DeleteAsync(entity, cancellationToken);
            }

            return result;
        }

        public virtual Task<T> GetByIdAsync(object id, CancellationToken cancellationToken = default)
        {
            return db.GetAsync<T>(id, transaction: t);
        }

        public virtual Task<int> CountAsync(CancellationToken cancellationToken = default)
        {
            var tableName = DapperUtils.GetTableName(typeof(T));
            var sql = $"select count(*) from {tableName}";
            return db.ExecuteScalarAsync<int>(sql, transaction: t);
        }

        public virtual Task<IEnumerable<T>> ListAllAsync(CancellationToken cancellationToken = default)
        {
            return db.GetAllAsync<T>(transaction: t);
        }

        public Task<IEnumerable<T>> ListAllAsync(bool isActive, CancellationToken cancellationToken = default)
        {
            var tableName = DapperUtils.GetTableName(typeof(T));
            var sql = $"select * from {tableName} where IsActive=@isActive";
            return db.QueryAsync<T>(sql, new { isActive }, transaction: t);
        }

        public virtual Task<IEnumerable<T>> ListRangeAsync(IEnumerable<object> ids, CancellationToken cancellationToken = default)
        {
            var tableName = DapperUtils.GetTableName(typeof(T));
            var sql = $"select * from {tableName} where Id in @ids";
            return db.QueryAsync<T>(sql, new { ids }, transaction: t);
        }

    }
    //public class EfRepository : IRepository
    //{
    //    private readonly AppDbContext _dbContext;

    //    public EfRepository(AppDbContext dbContext)
    //    {
    //        _dbContext = dbContext;
    //    }

    //    public T GetById<T>(int id) where T : BaseEntity, IAggregateRoot
    //    {
    //        return _dbContext.Set<T>().SingleOrDefault(e => e.Id == id);
    //    }

    //    public Task<T> GetByIdAsync<T>(int id) where T : BaseEntity, IAggregateRoot
    //    {
    //        return _dbContext.Set<T>().SingleOrDefaultAsync(e => e.Id == id);
    //    }

    //    public Task<List<T>> ListAsync<T>() where T : BaseEntity, IAggregateRoot
    //    {
    //        return _dbContext.Set<T>().ToListAsync();
    //    }

    //    public Task<List<T>> ListAsync<T>(ISpecification<T> spec) where T : BaseEntity, IAggregateRoot
    //    {
    //        var specificationResult = ApplySpecification(spec);
    //        return specificationResult.ToListAsync();
    //    }

    //    public async Task<T> AddAsync<T>(T entity) where T : BaseEntity, IAggregateRoot
    //    {
    //        await _dbContext.Set<T>().AddAsync(entity);
    //        await _dbContext.SaveChangesAsync();

    //        return entity;
    //    }

    //    public Task UpdateAsync<T>(T entity) where T : BaseEntity, IAggregateRoot
    //    {
    //        _dbContext.Entry(entity).State = EntityState.Modified;
    //        return _dbContext.SaveChangesAsync();
    //    }

    //    public Task DeleteAsync<T>(T entity) where T : BaseEntity, IAggregateRoot
    //    {
    //        _dbContext.Set<T>().Remove(entity);
    //        return _dbContext.SaveChangesAsync();
    //    }

    //    private IQueryable<T> ApplySpecification<T>(ISpecification<T> spec) where T : BaseEntity
    //    {
    //        var evaluator = new SpecificationEvaluator<T>();
    //        return evaluator.GetQuery(_dbContext.Set<T>().AsQueryable(), spec);
    //    }
    //}
}
