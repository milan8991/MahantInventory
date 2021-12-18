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
using static MahantInv.Core.Utility.Meta;

namespace MahantInv.Web.Api
{
    public class OrderApiController : BaseApiController
    {
        private readonly ILogger<OrderApiController> _logger;
        private readonly IOrdersRepository _orderRepository;
        public OrderApiController(IMapper mapper, ILogger<OrderApiController> logger, IOrdersRepository orderRepository) : base(mapper)
        {
            _logger = logger;
            _orderRepository = orderRepository;
        }
        [HttpGet("orders")]
        public async Task<object> GetallOrders()
        {
            try
            {
                IEnumerable<OrderVM> data = await _orderRepository.GetOrders();
                return Ok(data);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest("Unexpected Error " + GUID);
            }
        }
        [HttpPost("order/save")]
        public async Task<object> SaveOrder([FromBody] Order order)
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
                order.LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                order.ModifiedAt = DateTime.UtcNow;
                
                if (order.Id == 0)
                {
                    order.StatusId = OrderStatusTypes.Ordered;
                    order.RefNo = Guid.NewGuid().ToString();
                    order.Id = await _orderRepository.AddAsync(order);
                }
                else
                {
                    Order oldOrder = await _orderRepository.GetByIdAsync(order.Id);
                    oldOrder.ProductId = order.ProductId;
                    oldOrder.Quantity = order.Quantity;
                    oldOrder.PaymentTypeId = order.PaymentTypeId;
                    oldOrder.PayerId = order.PayerId;
                    oldOrder.PaidAmount = order.PaidAmount;
                    oldOrder.OrderDate = order.OrderDate;
                    oldOrder.Remark = order.Remark;
                    //oldOrder.RefNo = null;
                    oldOrder.LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                    oldOrder.ModifiedAt = DateTime.UtcNow;
                    await _orderRepository.UpdateAsync(oldOrder);
                }
                OrderVM orderVM = await _orderRepository.GetOrderById(order.Id);
                return Ok(new { success = true, data = orderVM });
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                ModelState.AddModelError("", "Unexpected Error " + GUID);
                List<ModelErrorCollection> errors = ModelState.Select(x => x.Value.Errors)
                          .Where(y => y.Count > 0)
                          .ToList();
                return BadRequest(errors);
            }
        }
        [HttpGet("order/byid/{orderId}")]
        public async Task<object> ProductGetById(int orderId)
        {
            try
            {
                Order order = await _orderRepository.GetByIdAsync(orderId);
                return Ok(order);
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
