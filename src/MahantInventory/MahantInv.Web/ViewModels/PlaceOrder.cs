using MahantInv.Core.SimpleAggregates;
using System.Collections.Generic;

namespace MahantInv.Web.ViewModels
{
    public class PlaceOrder
    {
        public Order Order { get; set; }
        public List<OrderTransaction> OrderTransacions { get; set; }
        public PlaceOrder()
        {
            Order = new Order();
            OrderTransacions = new List<OrderTransaction>();
        }
    }
}
