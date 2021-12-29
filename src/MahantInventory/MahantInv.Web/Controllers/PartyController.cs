using AutoMapper;
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
    public class PartyController : BaseController
    {
        private readonly ILogger<PartyController> _logger;
        private readonly IAsyncRepository<PartyCategory> _partyCategoryRepository;
        public PartyController(IMapper mapper, ILogger<PartyController> logger, IAsyncRepository<PartyCategory> partyCategoryRepository) : base(mapper)
        {
            _partyCategoryRepository = partyCategoryRepository;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                System.Type type = typeof(Meta.PartyTypes);
                var props = type.GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy);
                ViewBag.PartyTypes = new SelectList(props.Select(p => new SelectListItem() { Value = p.Name, Text = p.Name }).OrderBy(o => o.Value), "Value", "Text");
                ViewBag.Categories = (await _partyCategoryRepository.ListAllAsync()).OrderBy(o => o.Name);
                return View();
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }
    }
}
