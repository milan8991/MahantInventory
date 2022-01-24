using MahantInv.Core.SimpleAggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.ViewModels
{
    public class ProductUsageVM: ProductUsage
    {
        public string ProductName { get; set; }
        public string LastModifiedBy { get; set; }
        public string UsageDateFormat
        {
            get
            {
                return UsageDate.HasValue ? $"{UsageDate:dd/MM/yyyy}" : null;
            }
        }
    }
}
