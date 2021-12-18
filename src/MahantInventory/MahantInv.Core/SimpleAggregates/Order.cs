﻿using MahantInv.SharedKernel;
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
        [Required, Display(Name = "Received Quantity")]
        public decimal? ReceivedQuantity { get; set; }
        public string RefNo { get; set; }
        [Display(Name = "Status")]
        public string StatusId { get; set; }
        [Required, Display(Name = "Payment Type")]
        public int? PaymentTypeId { get; set; }
        [Required, Display(Name = "Payer")]
        public int? PayerId { get; set; }
        [Required, Display(Name = "Paid Amount")]
        public decimal? PaidAmount { get; set; }
        [Required, Display(Name = "Order Date")]
        public DateTime? OrderDate { get; set; }
        [Required, Display(Name = "Received Date")]
        public DateTime? ReceivedDate { get; set; }
        public string Remark { get; set; }
        [Display(Name = "Last Modified By")]
        public string LastModifiedById { get; set; }
        [Display(Name = "Modified At")]
        public DateTime? ModifiedAt { get; set; }
    }
}