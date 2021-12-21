using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace MahantInv.Infrastructure.Data
{
    public class ProductInventoryRepository : DapperRepository<ProductInventory>, IProductInventoryRepository
    {
        public ProductInventoryRepository(IDapperUnitOfWork uow) : base(uow)
        {
        }

        public Task<ProductInventory> GetByProductId(int productId)
        {
            return db.QuerySingleOrDefaultAsync<ProductInventory>("select * from dbo.ProductInventory where ProductId = @productId", new { productId }, transaction: t);
        }
    }
}
