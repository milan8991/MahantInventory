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

        public Task DeleteOrderTransactionByOrderId(int orderId)
        {
            return db.ExecuteAsync("delete from OrderTransactions where OrderId = @orderId", new { orderId }, transaction: t);
        }

        public async Task<OrderVM> GetOrderById(int orderId)
        {
            string sql = @"select * from vOrders o
                left outer join vOrderTransactions ot on o.Id = ot.OrderId
                    where o.Id = @orderId";
            var orderVMDictionary = new Dictionary<int, OrderVM>();
            var result = await db.QueryAsync<OrderVM, OrderTransactionVM, OrderVM>(sql,
                (order, orderTransaction) =>
                {
                    if (!orderVMDictionary.TryGetValue(order.Id, out OrderVM orderVMEntry))
                    {
                        orderVMEntry = order;
                        orderVMDictionary.Add(orderVMEntry.Id, orderVMEntry);
                    }
                    if (orderTransaction != null)
                    {
                        orderVMEntry.OrderTransactionVMs = new();
                        orderVMEntry.OrderTransactionVMs.Add(orderTransaction);
                    }
                    return orderVMEntry;
                },
                new { orderId },
                splitOn: "Id",
                 transaction: t);
            return result.Distinct().Single();
        }

        public async Task<IEnumerable<OrderVM>> GetOrders(DateTime startDate, DateTime endDate)
        {
            string sql = @"select * from vOrders o
                left outer join vOrderTransactions ot on o.Id = ot.OrderId
                where date(o.OrderDate) between date(@startDate) and date(@endDate)";
            var orderVMDictionary = new Dictionary<int, OrderVM>();
            var result = await db.QueryAsync<OrderVM, OrderTransactionVM, OrderVM>(sql,
                (order, orderTransaction) =>
                {
                    if (!orderVMDictionary.TryGetValue(order.Id, out OrderVM orderVMEntry))
                    {
                        orderVMEntry = order;
                        orderVMDictionary.Add(orderVMEntry.Id, orderVMEntry);
                    }
                    if (orderTransaction != null)
                    {
                        orderVMEntry.OrderTransactionVMs = new();
                        orderVMEntry.OrderTransactionVMs.Add(orderTransaction);
                    }
                    return orderVMEntry;
                },
                new { startDate, endDate },
                splitOn: "Id",
                 transaction: t);
            return result.Distinct().ToList();
        }
    }
}
