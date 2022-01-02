using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace MahantInv.Web.Controllers
{
    public class UnitTypeController : BaseController
    {
        public UnitTypeController(IMapper mapper) : base(mapper)
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
