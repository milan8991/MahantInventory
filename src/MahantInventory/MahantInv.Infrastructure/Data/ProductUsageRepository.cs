using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace MahantInv.Infrastructure.Data
{
    internal class ProductUsageRepository : DapperRepository<ProductUsage>, IProductUsageRepository
    {
        public ProductUsageRepository(IDapperUnitOfWork uow) : base(uow)
        {
        }

        public Task<IEnumerable<ProductUsageVM>> GetProductUsages()
        {
            return db.QueryAsync<ProductUsageVM>(@"select pu.*,p.Name as ProductName, u.Email as LastModifiedBy 
                            from ProductUsages pu
                            inner join Products p on pu.ProductId = p.Id
                            inner join AspNetUsers u on pu.LastModifiedById = u.Id limit 500", transaction: t);
        }
        public Task<ProductUsageVM> GetProductUsageById(int id)
        {
            return db.QuerySingleAsync<ProductUsageVM>(@"select pu.*,p.Name as ProductName, u.Email as LastModifiedBy 
                            from ProductUsages pu
                            inner join Products p on pu.ProductId = p.Id
                            inner join AspNetUsers u on pu.LastModifiedById = u.Id 
                            where pu.Id = @id", new { id }, transaction: t);
        }
    }
}
