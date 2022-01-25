using System;

namespace MahantInv.Web.ViewModels
{
    public class ProductUsageModel
    {
        public int ProductId { get; set; }
        public string Buyer { get; set; }
        public decimal Quantity { get; set; }
        public DateTime? UsageDate { get; set; }
    }
}
