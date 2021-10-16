using MahantInv.Infrastructure.Repository;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MahantInv.Infrastructure.Data
{
    public class UnitOfWork : IDapperUnitOfWork, IAsyncDisposable, IDisposable
    {
        private DbConnection _db;
        private DbTransaction _t;

        public DbConnection DbConnection => _db;
        public DbTransaction DbTransaction => _t;

        public UnitOfWork(DbProviderFactory dbProviderFactory, string connectionString)
        {
            _db = dbProviderFactory.CreateConnection();
            _db.ConnectionString = connectionString;
        }

        public async Task BeginAsync(CancellationToken cancellationToken = default)
        {
            if (_t is not null)
            {
                throw new InvalidOperationException("Previous transaction is in progress.");
            }

            await _db.OpenAsync(cancellationToken);
            _t = await _db.BeginTransactionAsync(cancellationToken);
        }

        public async Task CommitAsync(CancellationToken cancellationToken = default)
        {
            if (_t is null)
            {
                throw new InvalidOperationException("No transaction is in progress.");
            }

            await _t.CommitAsync(cancellationToken);
            await _t.DisposeAsync();
            _t = null;
            await _db.CloseAsync();
        }

        public async Task RollbackAsync(CancellationToken cancellationToken = default)
        {
            if (_t is null)
            {
                throw new InvalidOperationException("No transaction is in progress.");
            }

            await _t.RollbackAsync(cancellationToken);
            await _t.DisposeAsync();
            _t = null;
            await _db.CloseAsync();
        }

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        public async ValueTask DisposeAsync()
        {
            await DisposeAsyncCore();

            Dispose(disposing: false);
#pragma warning disable CA1816 // Dispose methods should call SuppressFinalize
            GC.SuppressFinalize(this);
#pragma warning restore CA1816 // Dispose methods should call SuppressFinalize
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                _t?.Dispose();
                _db?.Close();
                _db?.Dispose();
            }

            _t = null;
            _db = null;

        }

        protected virtual async ValueTask DisposeAsyncCore()
        {
            if (_t is not null)
            {
                await _t.DisposeAsync().ConfigureAwait(false);
            }

            if (_db is not null)
            {
                await _db.CloseAsync();
                await _db.DisposeAsync().ConfigureAwait(false);
            }

            _t = null;
            _db = null;
        }
    }
}
