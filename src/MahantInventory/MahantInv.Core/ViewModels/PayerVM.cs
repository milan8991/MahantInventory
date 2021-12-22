using MahantInv.Core.SimpleAggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.ViewModels
{   
    public class PayerVM: Payer
    {
        public string LastModifiedBy { get; set; }
    }
    
}
