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
    [Table("Payers")]
    public class Payer:BaseEntity,IAggregateRoot
    {
        public string Name { get; set; }
        public string PrimaryContact { get; set; }
        public string SecondaryContact { get; set; }
        public int? AddressId { get; set; }
        public string LastModifiedById { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }
}
