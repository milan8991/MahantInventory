using AutoMapper;
using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.ViewModels;
using MahantInv.SharedKernel.Interfaces;
using MahantInv.Web.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MahantInv.Web.Api
{
    public class ProductApiController : BaseApiController
    {
        private readonly ILogger<ProductApiController> _logger;
        private readonly IProductsRepository _productRepository;
        private readonly IProductInventoryRepository _productInventoryRepository;
        private readonly IAsyncRepository<ProductInventoryHistory> _productInventoryHistoryRepository;
        private readonly IAsyncRepository<ProductUsage> _productUsageRepository;
        private readonly IUnitOfWork _unitOfWork;
        public ProductApiController(IMapper mapper, IUnitOfWork unitOfWork, IAsyncRepository<ProductUsage> productUsageRepository, IAsyncRepository<ProductInventoryHistory> productInventoryHistoryRepository, IProductInventoryRepository productInventoryRepository, ILogger<ProductApiController> logger, IProductsRepository productRepository) : base(mapper)
        {
            _logger = logger;
            _productRepository = productRepository;
            _productInventoryHistoryRepository = productInventoryHistoryRepository;
            _productInventoryRepository = productInventoryRepository;
            _productUsageRepository = productUsageRepository;
            _unitOfWork = unitOfWork;
        }
        [HttpGet("products")]
        public async Task<object> GetAllProducats()
        {
            try
            {
                IEnumerable<ProductVM> data = await _productRepository.GetProducts();
                return Ok(data);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest("Unexpected Error " + GUID);
            }
        }
        [HttpPost("product/save")]
        public async Task<object> SaveProduct([FromBody] Product product)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    List<ModelErrorCollection> errors = ModelState.Select(x => x.Value.Errors)
                          .Where(y => y.Count > 0)
                          .ToList();
                    return BadRequest(errors);
                }
                product.LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                product.ModifiedAt = DateTime.UtcNow;
                product.Enabled = true;
                if (product.Id == 0)
                {
                    product.Id = await _productRepository.AddAsync(product);
                }
                else
                {
                    await _productRepository.UpdateAsync(product);
                }
                ProductVM productVM = await _productRepository.GetProductById(product.Id);
                return Ok(new { success = true, data = productVM });
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest("Unexpected Error " + GUID);
            }
        }
        [HttpGet("product/byid/{productId}")]
        public async Task<object> ProductGetById(int productId)
        {
            try
            {
                Product product = await _productRepository.GetByIdAsync(productId);
                return Ok(product);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest("Unexpected Error " + GUID);
            }
        }
        [HttpPost("product/usage")]
        public async Task<object> ProductUsage([FromBody] ProductUsageModel productUsageModel)
        {
            try
            {
                if (productUsageModel.Quantity <= 0)
                {
                    return BadRequest(new { success = false, errors = new[] { "Quantity must be larger than 0" } });
                }
                ProductUsage productUsage = new()
                {
                    ProductId = productUsageModel.ProductId,
                    Quantity = productUsageModel.Quantity,
                    RefNo = Guid.NewGuid().ToString(),
                    LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value,
                    ModifiedAt = DateTime.UtcNow
                };
                ProductInventory productInventory = await _productInventoryRepository.GetByProductId(productUsageModel.ProductId);

                if (productInventory == null)
                {
                    return BadRequest(new { success = false, errors = new[] { "Product/Stock not available" } });
                }

                ProductInventoryHistory productInventoryHistory = new()
                {
                    ProductId = productInventory.ProductId.Value,
                    LastModifiedById = productInventory.LastModifiedById,
                    ModifiedAt = productInventory.ModifiedAt,
                    Quantity = productInventory.Quantity,
                    RefNo = productInventory.RefNo
                };

                productInventory.Quantity -= productUsageModel.Quantity;
                productInventory.RefNo = productUsage.RefNo;
                productInventory.LastModifiedById = productUsage.LastModifiedById;
                productInventory.ModifiedAt = productUsage.ModifiedAt;

                await _unitOfWork.BeginAsync();
                await _productInventoryHistoryRepository.AddAsync(productInventoryHistory);
                await _productInventoryRepository.UpdateAsync(productInventory);
                await _productUsageRepository.AddAsync(productUsage);
                await _unitOfWork.CommitAsync();

                ProductVM productVM = await _productRepository.GetProductById(productUsageModel.ProductId);
                return Ok(new { success = true, data = productVM });
            }
            catch (Exception e)
            {
                await _unitOfWork.RollbackAsync();
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }

    }

}
