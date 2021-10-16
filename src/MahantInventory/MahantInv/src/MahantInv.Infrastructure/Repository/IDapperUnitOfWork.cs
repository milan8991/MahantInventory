using MahantInv.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Infrastructure.Repository
{
    public interface IDapperUnitOfWork : IUnitOfWork
    {
        DbConnection DbConnection { get; }
        DbTransaction DbTransaction { get; }
    }
}
