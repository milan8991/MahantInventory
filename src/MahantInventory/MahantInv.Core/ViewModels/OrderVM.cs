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
        public string Company { get; set; }
        public string ProductFullName
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Company))
                {
                    return ProductName;
                }
                return $"{ProductName} - {Company}";
            }
        }
        public string Status { get; set; }
        public string Seller { get; set; }
        public string LastModifiedBy { get; set; }
        public double? CurrentStock { get; set; }
        public double ReorderLevel { get; set; }
        public double? PaidAmount { get; set; }
        public string PaymentStatus
        {
            get
            {
                if (!NetAmount.HasValue || NetAmount.Value == 0) return "No Need";
                if (!PaidAmount.HasValue || PaidAmount.Value == 0) return "Pending";
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
        public string PaymentDateFormat
        {
            get
            {
                return PaymentDate.HasValue ? $"{PaymentDate:dd/MM/yyyy}" : null;
            }
        }
    }
    public class OrdersGrid : Order
    {
        public string ProductName { get; set; }
        public string Status { get; set; }
        public string Seller { get; set; }
        public string LastModifiedBy { get; set; }
        public double? CurrentStock { get; set; }
        public double ReorderLevel { get; set; }
        public string OrderDateFormat { get; set; }
        public string ReceivedDateFormat { get; set; }
        public string Payer { get; set; }//Party
        public string PaymentType { get; set; }
        public double? Amount { get; set; }
        public int OrderTransactionsCount { get; set; }
    }
}
