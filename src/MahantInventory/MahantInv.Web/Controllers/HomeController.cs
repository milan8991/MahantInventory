using AutoMapper;
using MahantInv.Core.SimpleAggregates;
using MahantInv.SharedKernel.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace MahantInv.Web.Controllers
{
    /// <summary>
    /// A sample MVC controller that uses views.
    /// Razor Pages provides a better way to manage view-based content, since the behavior, viewmodel, and view are all in one place,
    /// rather than spread between 3 different folders in your Web project. Look in /Pages to see examples.
    /// See: https://ardalis.com/aspnet-core-razor-pages-%E2%80%93-worth-checking-out/
    /// </summary>
    public class HomeController : BaseController
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IAsyncRepository<ProductUsage> _productUsageRepository;
        public HomeController(ILogger<HomeController> logger, IAsyncRepository<ProductUsage> productUsageRepository, IMapper mapper) : base(mapper)
        {
            _logger = logger;
            _productUsageRepository=productUsageRepository;
        }

        [Authorize]
        public async Task<IActionResult> Index()
        {
            try
            {
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

        public IActionResult Error()
        {
            return View();
        }
    }
}
