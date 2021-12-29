using AutoMapper;
using MahantInv.Core.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq;
using System.Reflection;

namespace MahantInv.Web.Controllers
{
    public class StorageController : BaseController
    {
        public StorageController(IMapper mapper) : base(mapper)
        {
        }

        public IActionResult Index()
        {            
            return View();
        }

    }
}
