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
    [Table("Parties")]
    public class Party:BaseEntity,IAggregateRoot
    {
        [Required,Display(Name ="Party Name")]
        public string Name { get; set; }
        [Required,Display(Name ="Party Type")]
        public string Type { get; set; }
        [Required,Display(Name ="Category")]
        public int? CategoryId { get; set; }
        [Display(Name = "Primary Contact")]
        public string PrimaryContact { get; set; }
        [Display(Name = "Secondary Contact")]
        public string SecondaryContact { get; set; }
        [Display(Name="Line 1")]
        public string Line1 { get; set; }
        [Display(Name = "Line 2")]
        public string Line2 { get; set; }
        public string Taluk { get; set; }
        public string District { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string LastModifiedById { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }
}
