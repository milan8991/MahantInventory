using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.ViewModels;
using MahantInv.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.Interfaces
{
    public interface IOrdersRepository : IAsyncRepository<Order>
    {
        Task<IEnumerable<OrderVM>> GetOrders(DateTime startDate, DateTime endDate);
        Task<OrderVM> GetOrderById(int orderId);
        Task DeleteOrderTransactionByOrderId(int orderId);
    }
}
