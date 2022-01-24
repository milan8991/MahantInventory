using MahantInv.SharedKernel;
using MahantInv.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.SimpleAggregates
{
    [Table("ProductUsages")]
    public class ProductUsage : ProductInventory, IAggregateRoot
    {
        public string Buyer { get; set; }
        public DateTime? UsageDate { get; set; }
    }
}
