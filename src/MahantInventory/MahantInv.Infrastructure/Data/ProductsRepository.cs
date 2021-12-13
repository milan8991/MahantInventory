using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Dapper;

namespace MahantInv.Infrastructure.Data
{
    public class ProductsRepository : DapperRepository<Product>, IProductsRepository
    {
        public ProductsRepository(IDapperUnitOfWork uow) : base(uow)
        {
        }

        public Task<IEnumerable<dynamic>> GetProducts()
        {
            return db.QueryAsync<dynamic>("select * from Products",transaction:t);
        }
    }
}
