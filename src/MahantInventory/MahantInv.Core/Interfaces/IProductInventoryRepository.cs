﻿using MahantInv.Core.SimpleAggregates;
using MahantInv.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.Interfaces
{
    public interface IProductInventoryReposiroty : IAsyncRepository<ProductInventory>
    {
        Task<ProductInventory> GetByProductId(int productId);
        Task IFStockLowGenerateNotification(int productId);
    }
}
