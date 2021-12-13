using MahantInv.Core.SimpleAggregates;
using System;

namespace MahantInv.Web.ViewModels
{
    public class ProductVM : Product
    {
        public string Storage { get; set; }
        public string LastModifiedBy { get; set; }
    }
}
