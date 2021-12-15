using AutoMapper;
using MahantInv.Core.SimpleAggregates;
using MahantInv.SharedKernel.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Threading.Tasks;

namespace MahantInv.Web.Controllers
{
    public class ProductController : BaseController
    {
        private readonly IAsyncRepository<Storage> _storageRepository;
        private readonly IAsyncRepository<UnitType> _unitTypeRepository;
        public ProductController(IMapper mapper, IAsyncRepository<Storage> storageRepository, IAsyncRepository<UnitType> unitTypeRepository) : base(mapper)
        {
            _storageRepository = storageRepository;
            _unitTypeRepository = unitTypeRepository;
        }

        public async Task<IActionResult> Index()
        {
            ViewBag.Storages = await _storageRepository.ListAllAsync();
            ViewBag.UnitTypes = await _unitTypeRepository.ListAllAsync();
            return View();
        }
    }
}
