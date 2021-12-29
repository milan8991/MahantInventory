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
    public interface IStorageRepository : IAsyncRepository<Storage>
    {
        Task<IEnumerable<StorageVM>> GetStorages();
        Task<StorageVM> GetStorageById(int StorageId);
    }
}
