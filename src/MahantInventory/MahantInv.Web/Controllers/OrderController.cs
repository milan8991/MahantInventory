using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MahantInv.Web.Controllers
{
    public class OrderController : BaseController
    {
        private readonly ILogger<OrderController> _logger;
        public OrderController(IMapper mapper) : base(mapper)
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
