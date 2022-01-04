﻿using AutoMapper;
using MahantInv.Core.Interfaces;
using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.Utility;
using MahantInv.Core.ViewModels;
using MahantInv.SharedKernel.Interfaces;
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
        private readonly IPayersReposiroty _productInventoryRepository;
        private readonly IAsyncRepository<ProductInventoryHistory> _productInventoryHistoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAsyncRepository<OrderTransaction> _orderTransactionRepository;
        public OrderApiController(IMapper mapper, IUnitOfWork unitOfWork, IAsyncRepository<OrderTransaction> orderTransactionRepository, IAsyncRepository<ProductInventoryHistory> productInventoryHistoryRepository, IPayersReposiroty productInventoryRepository, ILogger<OrderApiController> logger, IOrdersRepository orderRepository) : base(mapper)
        {
            _logger = logger;
            _orderRepository = orderRepository;
            _productInventoryRepository = productInventoryRepository;
            _unitOfWork = unitOfWork;
            _productInventoryHistoryRepository = productInventoryHistoryRepository;
            _orderTransactionRepository = orderTransactionRepository;
        }
        [HttpGet("orders")]
        public async Task<object> GetallOrders()
        {
            try
            {
                DateTime endDate = DateTime.Now.Date;
                DateTime startDate = endDate.AddMonths(-3);
                IEnumerable<OrderVM> data = await _orderRepository.GetOrders(startDate, endDate);

                //List<OrdersGrid> gridDataList = new();
                //foreach (var order in data)
                //{
                //    if (order.OrderTransactionsCount == 0)
                //    {
                //        var gridData = _mapper.Map<OrdersGrid>(order);
                //        gridDataList.Add(gridData);
                //    }
                //    else
                //    {
                //        foreach (var tran in order.OrderTransactionVMs)
                //        {
                //            OrdersGrid gridOrder = _mapper.Map<OrdersGrid>(order);
                //            gridOrder.Payer = tran.Party;
                //            gridOrder.PaymentType = tran.PaymentType;
                //            gridOrder.Amount = tran.Amount;
                //            gridDataList.Add(gridOrder);
                //        }
                //    }
                //}

                return Ok(data);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
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
                    return BadRequest(new { success = false, errors });
                }
                await LogOrder(order, isReceived: false);
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
                return BadRequest(new { success = false, errors });
            }
        }
        private async Task<Order> LogOrder(Order order, bool isReceived)
        {
            Order returnOrder;
            order.LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            order.ModifiedAt = DateTime.UtcNow;
            order.StatusId = isReceived ? OrderStatusTypes.Received : OrderStatusTypes.Ordered;

            if (order.Id == 0)
            {
                order.RefNo = Guid.NewGuid().ToString();
                order.Id = await _orderRepository.AddAsync(order);
                returnOrder = order;
            }
            else
            {
                Order oldOrder = await _orderRepository.GetByIdAsync(order.Id);
                oldOrder.ProductId = order.ProductId;
                oldOrder.Quantity = order.Quantity;
                oldOrder.OrderDate = order.OrderDate;
                oldOrder.Remark = order.Remark;
                oldOrder.ReceivedDate = order.ReceivedDate;
                oldOrder.ReceivedQuantity = order.ReceivedQuantity;
                oldOrder.LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                oldOrder.ModifiedAt = DateTime.UtcNow;
                oldOrder.StatusId = order.StatusId;
                await _orderRepository.UpdateAsync(oldOrder);
                await _orderRepository.DeleteOrderTransactionByOrderId(oldOrder.Id);
                returnOrder = oldOrder;
            }
            foreach (OrderTransaction orderTransaction in order.OrderTransactions)
            {
                OrderTransaction ot = new()
                {
                    OrderId = order.Id,
                    PartyId = orderTransaction.PartyId,
                    PaymentTypeId = orderTransaction.PaymentTypeId,
                    Amount = orderTransaction.Amount
                };
                await _orderTransactionRepository.AddAsync(ot);
                returnOrder.OrderTransactions.Add(ot);
            }
            return returnOrder;
        }
        [HttpGet("order/byid/{orderId}")]
        public async Task<object> OrderGetById(int orderId)
        {
            try
            {
                Order order = await _orderRepository.GetOrderById(orderId);
                return Ok(order);
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }
        [HttpPost("order/receive")]
        public async Task<object> ReceiveOrder([FromBody] Order order)
        {
            try
            {
                if (!order.ReceivedQuantity.HasValue)
                {
                    ModelState.AddModelError(nameof(order.ReceivedQuantity), "Received Quantity field is required");
                }
                if (order.ReceivedQuantity <= 0)
                {
                    ModelState.AddModelError(nameof(order.ReceivedQuantity), "Received Quantity larger than 0");
                }
                if (!order.ReceivedDate.HasValue)
                {
                    ModelState.AddModelError(nameof(order.ReceivedQuantity), "Received Date field is required");
                }
                if (order.ReceivedDate.Value > DateTime.Today.Date)
                {
                    ModelState.AddModelError(nameof(order.ReceivedQuantity), "Received Date can't be future date");
                }
                if (!order.OrderTransactions.Any())
                {
                    ModelState.AddModelError(nameof(order.ReceivedQuantity), "Please add atleast one payer");
                }
                if (!ModelState.IsValid)
                {
                    List<ModelErrorCollection> errors = ModelState.Select(x => x.Value.Errors)
                          .Where(y => y.Count > 0)
                          .ToList();
                    return BadRequest(new { success = false, errors });
                }

                ProductInventory productInventory = await _productInventoryRepository.GetByProductId(order.ProductId.Value);

                await _unitOfWork.BeginAsync();
                var oldOrder = await LogOrder(order, isReceived: true);

                if (productInventory == null)
                {
                    await _productInventoryRepository.AddAsync(new ProductInventory
                    {
                        ProductId = oldOrder.ProductId.Value,
                        Quantity = order.ReceivedQuantity,
                        RefNo = oldOrder.RefNo,
                        LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value,
                        ModifiedAt = DateTime.UtcNow
                    });
                }
                else
                {
                    await _productInventoryHistoryRepository.AddAsync(new ProductInventoryHistory
                    {
                        ProductId = productInventory.ProductId.Value,
                        LastModifiedById = productInventory.LastModifiedById,
                        ModifiedAt = productInventory.ModifiedAt,
                        Quantity = productInventory.Quantity,
                        RefNo = productInventory.RefNo
                    });

                    productInventory.Quantity += order.ReceivedQuantity;
                    productInventory.RefNo = oldOrder.RefNo;
                    productInventory.LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                    productInventory.ModifiedAt = DateTime.UtcNow;
                    await _productInventoryRepository.UpdateAsync(productInventory);
                }
                await _unitOfWork.CommitAsync();
                OrderVM orderVM = await _orderRepository.GetOrderById(order.Id);
                return Ok(new { success = true, data = orderVM });
            }
            catch (Exception e)
            {
                string GUID = Guid.NewGuid().ToString();
                _logger.LogError(e, GUID, null);
                return BadRequest(new { success = false, errors = new[] { "Unexpected Error " + GUID } });
            }
        }
        [HttpPost("order/cancel")]
        public async Task<object> CancelOrder([FromBody] int orderId)
        {
            try
            {
                Order oldOrder = await _orderRepository.GetByIdAsync(orderId);
                if (!oldOrder.StatusId.Equals(Meta.OrderStatusTypes.Ordered))
                {
                    return BadRequest(new { success = false, errors = new[] { "Order not in Ordered state." } });
                }
                oldOrder.StatusId = Meta.OrderStatusTypes.Cancelled;
                oldOrder.LastModifiedById = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                oldOrder.ModifiedAt = DateTime.UtcNow;
                await _orderRepository.UpdateAsync(oldOrder);
                OrderVM orderVM = await _orderRepository.GetOrderById(orderId);
                return Ok(new { success = true, data = orderVM });
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
