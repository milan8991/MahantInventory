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
        private readonly IStorageRepository _storageRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ProductApiController(IUnitOfWork unitOfWork, IStorageRepository storageRepository, IMapper mapper, ILogger<ProductApiController> logger, IProductsRepository productRepository) : base(mapper)
        {
            _logger = logger;
            _productRepository = productRepository;
            _storageRepository = storageRepository;
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
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
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
                if (string.IsNullOrWhiteSpace(product.StorageNames))
                {
                    return BadRequest(new { success = false, errors = new[] { "Storage field is required" } });
                }


                product.LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                product.ModifiedAt = DateTime.UtcNow;
                product.Enabled = true;
                var storages = await _storageRepository.ListAllAsync();
                await _unitOfWork.BeginAsync();
                if (product.Id == 0)
                {
                    product.Id = await _productRepository.AddAsync(product);
                }
                else
                {
                    await _productRepository.UpdateAsync(product);
                }
                await _unitOfWork.CommitAsync();

                List<ProductStorage> ProductStorages = product.StorageNames.Split(",")
                    .Select(s => new ProductStorage { ProductId = product.Id, StorageName = s.Trim() }).ToList();

                await _productRepository.RemoveProductStorages(product.Id);

                foreach (var productStorage in ProductStorages)
                {
                    Storage matchedStorage = storages.SingleOrDefault(s => s.Name.Equals(productStorage.StorageName, StringComparison.Ordinal));

                    if (matchedStorage == null)
                    {
                        productStorage.StorageId = await _storageRepository.AddAsync(new Storage { Name = productStorage.StorageName, Enabled = true });
                    }
                    else
                    {
                        productStorage.StorageId = matchedStorage.Id;
                    }
                    await _productRepository.AddProductStorage(productStorage);
                }




                ProductVM productVM = await _productRepository.GetProductById(product.Id);
                return Ok(new { success = true, data = productVM });
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
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
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }


    }

}
