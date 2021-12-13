using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace MahantInv.Web.Controllers
{
    public class ProductController : BaseController
    {
        public ProductController(IMapper mapper) : base(mapper)
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
