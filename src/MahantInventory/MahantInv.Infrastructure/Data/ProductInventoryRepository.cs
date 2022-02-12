using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MahantInv.SharedKernel.Interfaces;
using MahantInv.Core.Utility;

namespace MahantInv.Infrastructure.Data
{
    public class ProductInventoryRepository : DapperRepository<ProductInventory>, IProductInventoryRepository
    {
        private readonly IProductsRepository _productRepository;
        private readonly IAsyncRepository<Notification> _notificationRepository;
        public ProductInventoryRepository(IAsyncRepository<Notification> notificationRepository, IProductsRepository productRepository, IDapperUnitOfWork uow) : base(uow)
        {
            _productRepository = productRepository;
            _notificationRepository = notificationRepository;
        }

        public Task<ProductInventory> GetByProductId(int productId)
        {
            return db.QuerySingleOrDefaultAsync<ProductInventory>("select * from ProductInventory where ProductId = @productId", new { productId }, transaction: t);
        }

        public Task<IEnumerable<Notification>> GetNotificationByStatus(string status)
        {
            return db.QueryAsync<Notification>("select * from Notifications where status = @status", new { status }, transaction: t);
        }

        public async Task IFStockLowGenerateNotification(int productId)
        {
            ProductInventory productInventory = await GetByProductId(productId);

            Product product = await _productRepository.GetByIdAsync(productId);
            if (productInventory.Quantity.HasValue && product.ReorderLevel.HasValue)
            {
                if ((decimal)productInventory.Quantity.Value < product.ReorderLevel.Value)
                {

                    Notification notification = new()
                    {
                        Status = Meta.NotificationStatusTypes.Pending,
                        CreatedAt = Meta.Now,
                        ModifiedAt = Meta.Now,
                        Title = "Low Stock",
                        Message = $@"{product.Name}, {product.UnitTypeCode}, {product.Size}. 
                            Reorder Level:{product.ReorderLevel}. Current Stock:{productInventory.Quantity}"
                    };
                    await _notificationRepository.AddAsync(notification);
                }
            }
        }
    }
}
