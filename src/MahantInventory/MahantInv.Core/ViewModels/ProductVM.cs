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
        public decimal CurrentStock { get; set; }
        public string UnitTypeName { get; set; }
        public string Disposable
        {
            get
            {
                return this.IsDisposable ? "Yes" : "No";
            }
        }
    }
}
