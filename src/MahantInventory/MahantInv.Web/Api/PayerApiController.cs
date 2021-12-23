using AutoMapper;
using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MahantInv.Web.Api
{
    public class PayerApiController : BaseApiController
    {
        private readonly ILogger<PayerApiController> _logger;
        private readonly IPayersRepository _payersRepository;
        public PayerApiController(IMapper mapper, IPayersRepository payersRepository, ILogger<PayerApiController> logger) : base(mapper)
        {
            _payersRepository = payersRepository;
            _logger = logger;
        }
        [HttpGet("payers")]
        public async Task<object> GetAllPayers()
        {
            try
            {
                IEnumerable<PayerVM> data = await _payersRepository.GetPayers();
                return Ok(data);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }

        [HttpPost("payer/save")]
        public async Task<object> SavePayer([FromBody] Payer payer)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    List<ModelErrorCollection> errors = ModelState.Select(x => x.Value.Errors)
                          .Where(y => y.Count > 0)
                          .ToList();
                    return BadRequest(errors);
                }

                payer.LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                payer.ModifiedAt = DateTime.UtcNow;
                if (payer.Id == 0)
                {
                    await _payersRepository.AddAsync(payer);
                }
                else
                {
                    await _payersRepository.UpdateAsync(payer);
                }
                PayerVM payerVM = await _payersRepository.GetPayerById(payer.Id);
                return Ok(new { success = true, data = payerVM });
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }

        [HttpGet("payer/byid/{payerId}")]
        public async Task<object> PayerGetById(int payerId)
        {
            try
            {
                Payer payer = await _payersRepository.GetByIdAsync(payerId);
                return Ok(payer);
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
