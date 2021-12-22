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
    public class OrdersRepository : DapperRepository<Order>, IOrdersRepository
    {
        public OrdersRepository(IDapperUnitOfWork uow) : base(uow)
        {
        }

        public Task<OrderVM> GetOrderById(int orderId)
        {
            return db.QuerySingleAsync<OrderVM>(
            @"select o.*,p.Name as ProductName,ost.Title as Status,pt.Title as PaymentType,py.Name as Payer,u.UserName as LastModifiedBy, pi.Quantity as CurrentStock,p.ReorderLevel
                    from Orders o
                    inner join Products p on o.ProductId = p.Id
                    inner join OrderStatusTypes ost on o.StatusId = ost.Id
                    inner join PaymentTypes pt on o.PaymentTypeId = pt.Id
                    inner join Payers py on o.PayerId = py.Id
                    inner join AspNetUsers u on o.LastModifiedById = u.Id
                    left outer join ProductInventory pi on p.Id = pi.ProductId
                    where o.Id = @orderId", new { orderId }, transaction: t);
        }

        public Task<IEnumerable<OrderVM>> GetOrders()
        {
            return db.QueryAsync<OrderVM>(
            @"select o.*,p.Name as ProductName,ost.Title as Status,pt.Title as PaymentType,py.Name as Payer,u.UserName as LastModifiedBy, pi.Quantity as CurrentStock,p.ReorderLevel
                    from Orders o
                    inner join Products p on o.ProductId = p.Id
                    inner join OrderStatusTypes ost on o.StatusId = ost.Id
                    inner join PaymentTypes pt on o.PaymentTypeId = pt.Id
                    inner join Payers py on o.PayerId = py.Id
                    inner join AspNetUsers u on o.LastModifiedById = u.Id
                    left outer join ProductInventory pi on p.Id = pi.ProductId
                    order by o.OrderDate desc limit 100", transaction: t);
        }
    }
}
