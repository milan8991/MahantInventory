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
    [Table("OrderTransactions")]
    public class OrderTransaction : BaseEntity, IAggregateRoot
    {
        public int OrderId { get; set; }
        public int PartyId { get; set; }
        public int PaymentTypeId { get; set; }
        public decimal Amount { get; set; }
    }
}
