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

        public Task<ProductVM> GetProductById(int productId)
        {
            return db.QuerySingleAsync<ProductVM>(@"select p.*, s.Name as [Storage], u.UserName as [LastModifiedBy], ut.Name as [UnitTypeName], pi.Quantity as [CurrentStock] from Products p
                        inner join AspNetUsers u on p.LastModifiedById = u.Id
                        left outer join Storages s on p.StorageId = s.Id
                        left outer join UnitTypes ut on p.UnitTypeCode = ut.Code
                        left outer join ProductInventory pi on p.Id = pi.ProductId
                        where p.Id = @productId",new { productId }, transaction: t);
        }

        public Task<IEnumerable<ProductVM>> GetProducts()
        {
            return db.QueryAsync<ProductVM>(@"select p.*, s.Name as [Storage], u.UserName as [LastModifiedBy], ut.Name as [UnitTypeName], pi.Quantity as [CurrentStock] from Products p
                        inner join AspNetUsers u on p.LastModifiedById = u.Id
                        left outer join Storages s on p.StorageId = s.Id
                        left outer join UnitTypes ut on p.UnitTypeCode = ut.Code
                        left outer join ProductInventory pi on p.Id = pi.ProductId", transaction:t);
        }
    }
}
