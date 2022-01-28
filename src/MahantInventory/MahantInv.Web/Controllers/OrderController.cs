using AutoMapper;
using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.Utility;
using MahantInv.SharedKernel.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace MahantInv.Web.Controllers
{
    public class OrderController : BaseController
    {
        private readonly ILogger<OrderController> _logger;
        private readonly IAsyncRepository<Party> _partyRespository;
        private readonly IAsyncRepository<PaymentType> _paymentTypeRespository;
        private readonly IProductsRepository _productsRepository;
        private readonly IStorageRepository _storageRepository;
        private readonly IAsyncRepository<UnitType> _unitTypeRepository;
        private readonly IProductUsageRepository _productUsageRepository;
        public OrderController(IProductUsageRepository productUsageRepository,IAsyncRepository<UnitType> unitTypeRepository,IStorageRepository storageRepository,IMapper mapper, ILogger<OrderController> logger, IProductsRepository productsRepository, IAsyncRepository<PaymentType> paymentTypeRespository, IAsyncRepository<Party> partyRespository) : base(mapper)
        {
            _logger = logger;
            _partyRespository = partyRespository;
            _paymentTypeRespository = paymentTypeRespository;
            _productsRepository = productsRepository;
            _storageRepository = storageRepository;
            _unitTypeRepository = unitTypeRepository;
            _productUsageRepository = productUsageRepository;
        }

        public async Task<IActionResult> Index([FromServices] IAsyncRepository<PartyCategory> _partyCategoryRepository)
        {
            try
            {
                ViewBag.Products = await _productsRepository.GetProducts();
                ViewBag.PaymentTypes = await _paymentTypeRespository.ListAllAsync();
                ViewBag.Parties = await _partyRespository.ListAllAsync();
                System.Type type = typeof(Meta.PartyTypes);
                var props = type.GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy);
                ViewBag.PartyTypes = new SelectList(props.Select(p => new SelectListItem() { Value = p.Name, Text = p.Name }).OrderBy(o => o.Value), "Value", "Text");
                ViewBag.Categories = (await _partyCategoryRepository.ListAllAsync()).OrderBy(o => o.Name);

                ViewBag.Storages = await _storageRepository.ListAllAsync();
                ViewBag.UnitTypes = await _unitTypeRepository.ListAllAsync();
                ViewBag.Buyers = new SelectList((await _productUsageRepository.ListAllAsync()), "Buyer", "Buyer");
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
