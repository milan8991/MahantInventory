﻿using AutoMapper;
using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.SharedKernel.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace MahantInv.Web.Controllers
{
    public class ProductController : BaseController
    {
        private readonly ILogger<ProductController> _logger;
        private readonly IAsyncRepository<Storage> _storageRepository;
        private readonly IAsyncRepository<UnitType> _unitTypeRepository;
        public ProductController(IMapper mapper, ILogger<ProductController> logger, IAsyncRepository<Storage> storageRepository, IAsyncRepository<UnitType> unitTypeRepository) : base(mapper)
        {
            _logger = logger;
            _storageRepository = storageRepository;
            _unitTypeRepository = unitTypeRepository;
        }

        public async Task<IActionResult> Index([FromServices] IBuyersRepository _buyersRepository)
        {
            try
            {
                ViewBag.Storages = await _storageRepository.ListAllAsync();
                ViewBag.UnitTypes = await _unitTypeRepository.ListAllAsync();
                ViewBag.Buyers = await _buyersRepository.ListAllAsync();
                return View();
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
