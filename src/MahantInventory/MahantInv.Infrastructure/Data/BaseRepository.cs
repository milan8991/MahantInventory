using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Infrastructure.Data
{
    public class BaseRepository
    {
        protected readonly IDapperUnitOfWork _uow;
        protected DbConnection db => _uow?.DbConnection;
        protected DbTransaction t => _uow?.DbTransaction;

        public BaseRepository(IDapperUnitOfWork uow)
        {
            _uow = uow;
        }
    }
}
