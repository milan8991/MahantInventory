using MahantInv.Core.SimpleAggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.ViewModels
{
    public class ProductVM : Product
    {
        public string Storage { get; set; }
        public string LastModifiedBy { get; set; }
    }
}
