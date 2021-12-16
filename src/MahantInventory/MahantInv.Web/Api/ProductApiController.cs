﻿using AutoMapper;
using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.ViewModels;
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
        public ProductApiController(IMapper mapper, ILogger<ProductApiController> logger, IProductsRepository productRepository) : base(mapper)
        {
            _logger = logger;
            _productRepository = productRepository;
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
                    await _productRepository.AddAsync(product);
                }
                else
                {
                    await _productRepository.UpdateAsync(product);
                }
                return Ok();
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest("Unexpected Error " + GUID);
            }
        }
        [HttpGet("product/byid")]
        public async Task<object> ProductGetById([FromQuery] int productId)
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

    }

}
