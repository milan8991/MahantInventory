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
using Microsoft.Extensions.Options;
using MahantInv.Core.ViewModels;

namespace MahantInv.Infrastructure.Data
{
    public class ProductInventoryRepository : DapperRepository<ProductInventory>, IProductInventoryRepository
    {
        private readonly IProductsRepository _productRepository;
        private readonly IAsyncRepository<Notification> _notificationRepository;
        private readonly IEmailService _emailService;
        public ProductInventoryRepository(IEmailService emailService, IAsyncRepository<Notification> notificationRepository, IProductsRepository productRepository, IDapperUnitOfWork uow) : base(uow)
        {
            _productRepository = productRepository;
            _notificationRepository = notificationRepository;
            _emailService = emailService;
        }

        public Task<ProductInventory> GetByProductId(int productId)
        {
            return db.QuerySingleOrDefaultAsync<ProductInventory>("select * from ProductInventory where ProductId = @productId", new { productId }, transaction: t);
        }

        public Task<IEnumerable<Notification>> GetNotificationByStatus(List<string> status)
        {
            return db.QueryAsync<Notification>("select * from Notifications where status in @status order by CreatedAt desc", new { status }, transaction: t);
        }

        public async Task IFStockLowGenerateNotification(int productId)
        {
            ProductInventory productInventory = await GetByProductId(productId);

            Product product = await _productRepository.GetByIdAsync(productId);
            if (productInventory.Quantity.HasValue && product.ReorderLevel.HasValue)
            {
                if ((decimal)productInventory.Quantity.Value < product.ReorderLevel.Value)
                {
                    Email email = new()
                    {
                        Subject = new StringBuilder("Low Stock")
                        ,
                        Body = new StringBuilder($@"{product.Name}, {product.UnitTypeCode}, {product.Size}. 
                            Reorder Level:{product.ReorderLevel}. Current Stock:{productInventory.Quantity}")
                        ,
                        IsBodyHtml = true
                    };
                    Notification notification = new()
                    {
                        Status = Meta.NotificationStatusTypes.Pending,
                        CreatedAt = Meta.Now,
                        ModifiedAt = Meta.Now,
                        Title = email.Subject.ToString(),
                        Message = email.Body.ToString()
                    };
                    try
                    {
                        await _emailService.SendEmailAsync(email);
                    }
                    catch (Exception)
                    {
                        //Log Error
                    }
                    await _notificationRepository.AddAsync(notification);
                }
            }
        }
    }
}
