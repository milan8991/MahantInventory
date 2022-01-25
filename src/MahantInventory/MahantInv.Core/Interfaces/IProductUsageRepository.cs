using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.ViewModels;
using MahantInv.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.Interfaces
{
    public interface IProductUsageRepository : IAsyncRepository<ProductUsage>
    {
        Task<IEnumerable<ProductUsageVM>> GetProductUsages();
        Task<ProductUsageVM> GetProductUsageById(int id);
    }
}
