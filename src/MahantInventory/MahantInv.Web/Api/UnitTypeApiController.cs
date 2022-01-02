using AutoMapper;
using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.ViewModels;
using MahantInv.SharedKernel.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MahantInv.Web.Api
{
    public class UnitTypeApiController : BaseApiController
    {
        private readonly ILogger<UnitTypeApiController> _logger;
        private readonly IAsyncRepository<UnitType> _unitTypeRepository;
        private readonly IProductsRepository _productsRepository;
        public UnitTypeApiController(IProductsRepository productsRepository, IAsyncRepository<UnitType> unitTypeRepository, ILogger<UnitTypeApiController> logger, IMapper mapper) : base(mapper)
        {
            _logger = logger;
            _unitTypeRepository = unitTypeRepository;
            _productsRepository = productsRepository;
        }
        [HttpGet("unittypes")]
        public async Task<object> GetAllUnitTypes()
        {
            try
            {
                System.Collections.Generic.IEnumerable<UnitType> unitTypes = await _unitTypeRepository.ListAllAsync();
                return Ok(unitTypes);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }
        //[HttpGet("unittype/bycode/{code}")]
        //public async Task<object> GetUnitTypeByCode(string code)
        //{
        //    try
        //    {
        //        UnitType unitType = await _unitTypeRepository.GetByIdAsync(code);
        //        return Ok(unitType);
        //    }
        //    catch (Exception e)
        //    {
        //        string GUID = Guid.NewGuid().ToString();
        //        _logger.LogError(e, GUID, null);
        //        return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
        //    }
        //}
        [HttpPost("unittype/save")]
        public async Task<object> SaveUnitType([FromBody] UnitType unitType)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    List<ModelErrorCollection> errors = ModelState.Select(x => x.Value.Errors)
                          .Where(y => y.Count > 0)
                          .ToList();
                    return BadRequest(new { success = false, errors });
                }
                UnitType newUnitType = await _unitTypeRepository.GetByIdAsync(unitType.Code);
                if (unitType == null)
                {
                    await _unitTypeRepository.AddAsync(new UnitType { Code = unitType.Code, Name = unitType.Name });
                }
                else
                {
                    return BadRequest(new { success = false, errors = new[] { "Unit Type already exist" } });
                }
                return Ok(unitType);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }
        [HttpPost("unittype/delete")]
        public async Task<object> UpdateUnitType([FromBody] string code)
        {
            try
            {
                UnitType unitType = await _unitTypeRepository.GetByIdAsync(code);
                if (unitType == null)
                {
                    return BadRequest(new { success = false, errors = new[] { "Unit Type not found" } });
                }

                if (await _productsRepository.IsProductExist(code))
                {
                    return BadRequest(new { success = false, errors = new[] { $"Some products are mapped with '{code}' unit type" } });
                }

                await _unitTypeRepository.DeleteAsync(unitType);
                return Ok(new { success = true });
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new
                {
                    success = false,
                    errors = new[] { "Unexpected Error " + GUID
    }
                });
            }
        }
    }
}
