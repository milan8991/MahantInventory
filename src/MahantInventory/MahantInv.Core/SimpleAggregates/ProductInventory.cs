using MahantInv.SharedKernel;
using MahantInv.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.SimpleAggregates
{
    [Table("ProductInventory")]
    public class ProductInventory : BaseEntity, IAggregateRoot
    {
        public int? ProductId { get; set; }
        public double? Quantity { get; set; }
        public string RefNo { get; set; }
        public string LastModifiedById { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }
    [Table("ProductInventoryHistory")]
    public class ProductInventoryHistory : ProductInventory, IAggregateRoot
    { 
    }
}

