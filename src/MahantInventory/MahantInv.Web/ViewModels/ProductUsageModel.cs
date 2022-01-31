using System;

namespace MahantInv.Web.ViewModels
{
    public class ProductUsageModel
    {
        public int ProductId { get; set; }
        public string Buyer { get; set; }
        public double Quantity { get; set; }
        public DateTime? UsageDate { get; set; }
    }
}
