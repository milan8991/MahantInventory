using MahantInv.Core.SimpleAggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.ViewModels
{
    public class OrderVM:Order
    {
        public string ProductName { get; set; }
        public string Status { get; set; }
        public string PaymentType { get; set; }
        public string Payer { get; set; }
        public string LastModifiedBy { get; set; }
        public decimal? CurrentStock { get; set; }
    }
}
