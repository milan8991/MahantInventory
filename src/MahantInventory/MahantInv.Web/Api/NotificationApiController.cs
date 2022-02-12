using AutoMapper;
using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.Utility;
using MahantInv.SharedKernel.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace MahantInv.Web.Api
{
    public class NotificationApiController : BaseApiController
    {
        private readonly ILogger<NotificationApiController> _logger;
        private readonly IProductInventoryRepository _productInventoryReposiroty;
        private readonly IAsyncRepository<Notification> _notificationRepository;
        public NotificationApiController(IAsyncRepository<Notification> notificationRepository, IProductInventoryRepository productInventoryReposiroty, ILogger<NotificationApiController> logger, IMapper mapper) : base(mapper)
        {
            _logger = logger;
            _productInventoryReposiroty = productInventoryReposiroty;
            _notificationRepository = notificationRepository;
        }
        [HttpGet("notification/pending")]
        public async Task<IActionResult> PendingNotification(int notificationId)
        {
            try
            {
                var pendingNotifications = await _productInventoryReposiroty.GetNotificationByStatus(Meta.NotificationStatusTypes.Pending);
                return Ok(pendingNotifications);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }

        [HttpPost("notification/notified")]
        public async Task<IActionResult> NotificationMarkAsNotified(int notificationId)
        {
            try
            {
                Notification notification = await _notificationRepository.GetByIdAsync(notificationId);
                notification.ModifiedAt = Meta.Now;
                notification.Status = Meta.NotificationStatusTypes.Notified;
                await _notificationRepository.UpdateAsync(notification);
                return Ok();
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }
        [HttpPost("notification/read")]
        public async Task<IActionResult> NotificationMarkAsRead(int notificationId)
        {
            try
            {
                Notification notification = await _notificationRepository.GetByIdAsync(notificationId);
                notification.ModifiedAt = Meta.Now;
                notification.Status = Meta.NotificationStatusTypes.Read;
                await _notificationRepository.UpdateAsync(notification);
                return Ok();
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
