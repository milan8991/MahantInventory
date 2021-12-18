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
    [Table("Addresses")]
    public class Address : BaseEntity, IAggregateRoot
    {
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string Taluk { get; set; }
        public string District { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
    }
}
