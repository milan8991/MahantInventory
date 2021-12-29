using AutoMapper;
using MahantInv.Core.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq;
using System.Reflection;

namespace MahantInv.Web.Controllers
{
    public class PartyController : BaseController
    {
        public PartyController(IMapper mapper) : base(mapper)
        {
        }

        public IActionResult Index()
        {
            System.Type type = typeof(Meta.PartyTypes);
            var props = type.GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy);
            ViewBag.PayerTypes = new SelectList(props.Select(p => new SelectListItem() { Value = p.Name, Text = p.Name }).OrderBy(o => o.Value), "Value", "Text");
            return View();
        }
    }
}
