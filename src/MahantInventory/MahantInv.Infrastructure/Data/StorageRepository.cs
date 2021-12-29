using Dapper;
using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Infrastructure.Data
{
    public class StorageRepository : DapperRepository<Storage>, IStorageRepository
    {
        public StorageRepository(IDapperUnitOfWork uow) : base(uow)
        {
        }

        public Task<StorageVM> GetStorageById(int storageId)
        {
            return db.QuerySingleAsync<StorageVM>(@"select * from Storages Id = @storageId", new { storageId }, transaction: t);
        }

        public Task<IEnumerable<StorageVM>> GetStorages()
        {
            return db.QueryAsync<StorageVM>(@"select * from Storages", transaction: t);
        }
    }
}
