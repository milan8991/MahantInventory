using AutoMapper;
using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.SharedKernel.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace MahantInv.Web.Controllers
{
    public class OrderController : BaseController
    {
        private readonly ILogger<OrderController> _logger;
        private readonly IAsyncRepository<Payer> _payerRespository;
        private readonly IAsyncRepository<PaymentType> _paymentTypeRespository;
        private readonly IProductsRepository _productsRepository;
        public OrderController(IMapper mapper, ILogger<OrderController> logger, IProductsRepository productsRepository, IAsyncRepository<PaymentType> paymentTypeRespository, IAsyncRepository<Payer> payerRespository) : base(mapper)
        {
            _logger = logger;
            _payerRespository = payerRespository;
            _paymentTypeRespository = paymentTypeRespository;
            _productsRepository = productsRepository;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                ViewBag.Products = await _productsRepository.GetProducts();
                ViewBag.PaymentTypes = await _paymentTypeRespository.ListAllAsync();
                ViewBag.Payers = await _payerRespository.ListAllAsync();
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
