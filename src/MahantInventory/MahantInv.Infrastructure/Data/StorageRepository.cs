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

        public Task<StorageVM> GetStorageById(int StorageId)
        {
            return db.QuerySingleAsync<StorageVM>(@"select s.*,u.UserName LastModifiedBy from Storages s 
                    inner join AspNetUsers u on s.LastModifiedById = u.Id 
                    where s.Id= @payerId", new { StorageId }, transaction: t);
        }

        public Task<IEnumerable<StorageVM>> GetStorages()
        {
            return db.QueryAsync<StorageVM>(@"select s.*,u.UserName LastModifiedBy from Storages s 
                    inner join AspNetUsers u on s.LastModifiedById = u.Id", transaction: t);
        }
    }
}
