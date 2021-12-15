using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using MahantInv.Core.ViewModels;

namespace MahantInv.Infrastructure.Data
{
    public class ProductsRepository : DapperRepository<Product>, IProductsRepository
    {
        public ProductsRepository(IDapperUnitOfWork uow) : base(uow)
        {
        }

        public Task<IEnumerable<ProductVM>> GetProducts()
        {
            return db.QueryAsync<ProductVM>("select * from Products",transaction:t);
        }
    }
}
