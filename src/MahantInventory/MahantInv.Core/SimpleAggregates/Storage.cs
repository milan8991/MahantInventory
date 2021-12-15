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
    [Table("Storages")]
    public class Storage : BaseEntity, IAggregateRoot
    {
        [Required,Display(Name ="Storage Name")]
        public string Name { get; set; }
        public bool Enabled { get; set; }
    }
}
