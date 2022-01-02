using MahantInv.SharedKernel;
using MahantInv.SharedKernel.Interfaces;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MahantInv.Core.SimpleAggregates
{
    [Table("UnitTypes")]
    public class UnitType : IAggregateRoot
    {
        [Dapper.Contrib.Extensions.ExplicitKey,Required]
        public string Code { get; set; }
        [Required, Display(Name = "Unit Type Name")]
        public string Name { get; set; }
        public List<BaseDomainEvent> Events = new();
    }
}
