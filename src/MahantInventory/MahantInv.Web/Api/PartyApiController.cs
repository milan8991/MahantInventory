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
    public class PartyApiController : BaseApiController
    {
        private readonly ILogger<PartyApiController> _logger;
        private readonly IPartiesRepository _partiesRepository;
        public PartyApiController(IMapper mapper, IPartiesRepository partiesRepository, ILogger<PartyApiController> logger) : base(mapper)
        {
            _partiesRepository = partiesRepository;
            _logger = logger;
        }
        [HttpGet("parties")]
        public async Task<object> GetAllParties()
        {
            try
            {
                IEnumerable<PartyVM> data = await _partiesRepository.GetParties();
                return Ok(data);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }

        [HttpPost("party/save")]
        public async Task<object> SavePayer([FromBody] Party party)
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

                party.LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                party.ModifiedAt = DateTime.UtcNow;
                if (party.Id == 0)
                {
                    await _partiesRepository.AddAsync(party);
                }
                else
                {
                    await _partiesRepository.UpdateAsync(party);
                }
                PartyVM payerVM = await _partiesRepository.GetPartyById(party.Id);
                return Ok(new { success = true, data = payerVM });
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }

        [HttpGet("party/byid/{partyId}")]
        public async Task<object> PartyGetById(int partyId)
        {
            try
            {
                Party payer = await _partiesRepository.GetByIdAsync(partyId);
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
