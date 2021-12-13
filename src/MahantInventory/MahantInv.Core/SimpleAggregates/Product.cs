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
    [Table("Products")]
    public class Product : BaseEntity, IAggregateRoot
    {
        [Required(ErrorMessage = "Product Name field is required")]
        public string Name { get; set; }
        public decimal? Size { get; set; }
        public string Description { get; set; }
        public string UnitTypeCode { get; set; }
        [Required(ErrorMessage = "Reorder Level field is required")]
        public decimal ReorderLevel { get; set; }
        public bool IsDisposable { get; set; }
        public string Company { get; set; }
        [Required(ErrorMessage = "Storage field is required")]
        public int StorageId { get; set; }
        public bool Enabled { get; set; }
        public string LastModifiedById { get; set; }
        public DateTime ModifiedAt { get; set; }
    }
}
