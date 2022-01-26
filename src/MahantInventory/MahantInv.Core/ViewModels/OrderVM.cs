using MahantInv.Core.SimpleAggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.ViewModels
{
    public class OrderVM : Order
    {
        public string ProductName { get; set; }
        public string Status { get; set; }
        public string Seller { get; set; }
        public string LastModifiedBy { get; set; }
        public decimal? CurrentStock { get; set; }
        public decimal ReorderLevel { get; set; }
        public decimal? PaidAmount { get; set; }
        public string PaymentStatus
        {
            get
            {
                if (!NetAmount.HasValue || NetAmount.Value == 0) return "No Need";
                if (!PaidAmount.HasValue || PaidAmount.Value==0) return "Pending";
                if (NetAmount > PaidAmount) return "Partially Paid";
                return "Paid";
            }
        }
        public string OrderDateFormat
        {
            get
            {
                return OrderDate.HasValue ? $"{OrderDate:dd/MM/yyyy}" : null;
            }
        }
        public string ReceivedDateFormat
        {
            get
            {
                return ReceivedDate.HasValue ? $"{ReceivedDate:dd/MM/yyyy}" : null;
            }
        }
        public List<OrderTransactionVM> OrderTransactionVMs { get; set; }
        public int OrderTransactionsCount
        {
            get
            {
                return OrderTransactionVMs == null ? 1 : OrderTransactionVMs.Count;
            }
        }

    }
    public class OrderTransactionVM : OrderTransaction
    {
        public string Party { get; set; }
        public string PaymentType { get; set; }
    }
    public class OrdersGrid : Order
    {
        public string ProductName { get; set; }
        public string Status { get; set; }
        public string Seller { get; set; }
        public string LastModifiedBy { get; set; }
        public decimal? CurrentStock { get; set; }
        public decimal ReorderLevel { get; set; }
        public string OrderDateFormat { get; set; }
        public string ReceivedDateFormat { get; set; }
        public string Payer { get; set; }//Party
        public string PaymentType { get; set; }
        public decimal? Amount { get; set; }
        public int OrderTransactionsCount { get; set; }
    }
}
