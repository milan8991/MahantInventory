using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace MahantInv.Infrastructure.Data
{
    public class PayersRepository : DapperRepository<Payer>, IPayersRepository
    {
        public PayersRepository(IDapperUnitOfWork uow) : base(uow)
        {
        }

        public Task<PayerVM> GetPayerById(int payerId)
        {
            return db.QuerySingleAsync<PayerVM>(@"select p.*,u.UserName LastModifiedBy from Payers p 
                    inner join AspNetUsers u on p.LastModifiedById = u.Id 
                    where p.Id= @payerId", new { payerId }, transaction: t);
        }

        public Task<IEnumerable<PayerVM>> GetPayers()
        {
            return db.QueryAsync<PayerVM>(@"select p.*,u.UserName LastModifiedBy from Payers p 
                    inner join AspNetUsers u on p.LastModifiedById = u.Id", transaction: t);
        }
    }
}
