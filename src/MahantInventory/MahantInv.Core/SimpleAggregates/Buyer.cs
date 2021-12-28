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
    [Table("Buyers")]
    public class Buyer : BaseEntity, IAggregateRoot
    {
        [Required, MaxLength(255)]
        public string Name { get; set; }
        [MaxLength(13)]
        public string Contact { get; set; }
    }
}
