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
    public class StorageApiController : BaseApiController
    {
        private readonly ILogger<StorageApiController> _logger;
        private readonly IStorageRepository _storageRepository;

        public StorageApiController(IMapper mapper, IStorageRepository storageRepository, ILogger<StorageApiController> logger) : base(mapper)
        {
            _storageRepository = storageRepository;
            _logger = logger;
        }

        [HttpGet("storages")]
        public async Task<object> GetAllStorages()
        {
            try
            {
                IEnumerable<StorageVM> data = await _storageRepository.GetStorages();
                return Ok(data);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest("Unexpected Error " + GUID);
            }
        }

        [HttpPost("storage/save")]
        public async Task<object> SaveStorage([FromBody] Storage storage)
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

                if (storage.Id == 0)
                {
                    storage.Enabled = true;
                    await _storageRepository.AddAsync(storage);
                }
                else
                {
                    storage.Enabled = true;
                    await _storageRepository.UpdateAsync(storage);
                }
                StorageVM storageVM = await _storageRepository.GetStorageById(storage.Id);
                return Ok(new { success = true, data = storageVM });
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest("Unexpected Error " + GUID);
            }
        }

        [HttpGet("storage/byid/{StorageId}")]
        public async Task<object> StorageGetById(int StorageId)
        {
            try
            {
                Storage Storage = await _storageRepository.GetByIdAsync(StorageId);
                return Ok(Storage);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest("Unexpected Error " + GUID);
            }
        }

    }
}
