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
    [Table("Orders")]
    public class Order : BaseEntity, IAggregateRoot
    {
        [Required, Display(Name = "Product")]
        public int? ProductId { get; set; }
        [Required, Display(Name = "Quantity")]
        public decimal? Quantity { get; set; }
        [Display(Name = "Received Quantity")]
        public decimal? ReceivedQuantity { get; set; }
        public string RefNo { get; set; }
        [Display(Name = "Status")]
        public string StatusId { get; set; }
        [Display(Name = "Seller")]
        public int? SellerId { get; set; }
        [Required, Display(Name = "Order Date")]
        public DateTime? OrderDate { get; set; }
        [Display(Name = "Received Date")]
        public DateTime? ReceivedDate { get; set; }
        [Display(Name ="Price Per Item")]
        public decimal? PricePerItem { get; set; }
        [Display(Name ="Discount(%)")]
        public decimal? Discount { get; set; }
        [Display(Name ="Tax(%)")]
        public decimal? Tax { get; set; }
        [Display(Name ="Discount Amount")]
        public decimal? DiscountAmount { get; set; }
        [Display(Name ="Net Amount")]
        public decimal? NetAmount { get; set; }
        public string Remark { get; set; }
        [Display(Name = "Last Modified By")]
        public string LastModifiedById { get; set; }
        [Display(Name = "Modified At")]
        public DateTime? ModifiedAt { get; set; }
        [Dapper.Contrib.Extensions.Write(false)]
        public List<OrderTransaction> OrderTransactions { get; set; }
        public Order()
        {
            OrderTransactions = new();
        }
    }
}
