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
    [Table("PaymentTypes")]
    public class PaymentType:IAggregateRoot
    {
        [Dapper.Contrib.Extensions.ExplicitKey]
        public string Id { get; set; }
        public string Title { get; set; }
    }
}
