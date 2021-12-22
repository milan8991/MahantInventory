using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace MahantInv.Web.Controllers
{
    public class PayerController : BaseController
    {
        public PayerController(IMapper mapper) : base(mapper)
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
