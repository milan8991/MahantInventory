var orderTransaction = [];
function ActionCellRenderer() { }

ActionCellRenderer.prototype.init = function (params) {
    this.params = params;

    this.eGui = document.createElement('span');
    if (params.data.status === 'Cancelled') {
        this.eGui.innerHTML = '';
    }
    else {
        this.eGui.innerHTML = '<button class="btn btn-sm btn-link" type="button" onclick="Common.OpenModal(this)" data-id="' + params.data.id + '" data-target="AddEditOrder">Edit</button>';
    }
}

ActionCellRenderer.prototype.getGui = function () {
    return this.eGui;
}
const stockClassRules = {
    'sick-days-warning': (params) => params.data.currentStock < params.data.reorderLevel
};
var orderGridOptions = {

    // define grid columns
    columnDefs: [
        {
            headerName: 'Product', field: 'productName', filter: 'agTextColumnFilter', headerTooltip: 'Name'
        },
        {
            headerName: 'Quantity', field: 'quantity', filter: 'agNumberColumnFilter', headerTooltip: 'Ordered Quantity'
        },
        {
            headerName: 'Received Quantity', field: 'receivedQuantity', filter: 'agNumberColumnFilter', headerTooltip: 'Received Quantity'
        },
        {
            headerName: 'Current Stock', field: 'currentStock', filter: 'agNumberColumnFilter', headerTooltip: 'Storage'
            , cellClassRules: stockClassRules
        },
        {
            headerName: 'Reorder Level', field: 'reorderLevel', filter: 'agNumberColumnFilter', headerTooltip: 'Reorder Level'
        },
        {
            headerName: 'Status', field: 'status', filter: 'agSetColumnFilter', headerTooltip: 'Status',
            cellRenderer: function (params) {

                if (params.value == 'Ordered') {
                    return '<button type="button" class="btn btn-outline-primary btn-sm" onclick="Common.OpenActionModal(this)" data-id="' + params.data.id + '">' + params.value + '</button>'
                }

                let cls = params.value == 'Received' ? 'success' : 'danger';
                return '<span class="badge badge-' + cls + '">' + params.value + '</span>';
            }
        },
        {
            headerName: 'Payment Type',
            field: 'paymentType', filter: 'agTextColumnFilter', headerTooltip: 'Payment Type'
        },
        {
            headerName: 'Payer', field: 'payer', filter: 'agTextColumnFilter', headerTooltip: 'Payer'
        },
        {
            headerName: 'Paid Amount', field: 'paidAmount', filter: 'agNumberColumnFilter', headerTooltip: 'Paid Amount'
        },
        {
            headerName: 'Order Date', field: 'orderDateFormat', filter: 'agDateColumnFilter', headerTooltip: 'Order Date'
        },
        {
            headerName: 'Received Date', field: 'receivedDateFormat', filter: 'agDateColumnFilter', headerTooltip: 'Received Date'
        },
        {
            headerName: 'Remark', field: 'remark', filter: 'agTextColumnFilter', headerTooltip: 'Remark'
        },
        {
            headerName: 'Last Modified By', field: 'lastModifiedBy', filter: 'agSetColumnFilter', headerTooltip: 'LastModifiedBy'
        },
        {
            headerName: '', field: 'id', headerTooltip: 'Action', pinned: 'right', width: 80, suppressSizeToFit: true,
            cellRenderer: 'actionCellRenderer',
        }
    ],
    sideBar: { toolPanels: ['columns', 'filters'] },

    defaultColDef: {
        editable: false,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 50,
        wrapText: true,
        autoHeight: true,
        floatingFilter: true,
    },
    pagination: true,
    paginationAutoPageSize: true,
    animateRows: true,
    defaultColGroupDef: {
        marryChildren: true
    },

    getRowNodeId: function (data) {
        return data.id;
    },
    autoSizeColumn: true,
    suppressContextMenu: true,
    components: {
        actionCellRenderer: ActionCellRenderer
    },
    columnTypes: {
        numberColumn: {
            minWidth: 50,
        },
        dateColumn: {
            minWidth: 130,
        }
    },
    onGridReady: function (params) {
        const allColumnIds = [];
        orderGridOptions.columnApi.getAllColumns().forEach((column) => {
            if (column.colId != 'id')
                allColumnIds.push(column.colId);
        });
        orderGridOptions.columnApi.autoSizeColumns(allColumnIds, false);
    },
    overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center">Please wait while your orders are loading</span>',
    overlayNoRowsTemplate:
        `<div class="text-center">
                <h5 class="text-center"><b>Orders will be appear here.</b></h5>
            </div>`
};


class Order {
    constructor(Id, ProductId, Quantity, OrderDate, Remark, ReceivedQuantity, ReceivedDate) {
        this.Id = parseInt(Id);
        this.ProductId = ProductId;
        this.Quantity = Quantity;
        this.OrderDate = OrderDate;
        this.Remark = Common.ParseValue(Remark);
        this.ReceivedQuantity = ReceivedQuantity;
        this.ReceivedDate = ReceivedDate;
        this.OrderTransaction = [];
    }
}
class OrderTransaction {
    constructor(Id, PartyId, Party, PaymentTypeId, PaymentType, Amount) {
        this.Id = Id;
        this.PartyId = PartyId;
        this.Party = Party;
        this.PaymentTypeId = PaymentTypeId;
        this.PaymentType = PaymentType;
        this.Amount = Amount;
    }
}

class Common {
    static ParseValue(val) {
        if (val == null) return null;
        if (val == '') return null;
        return val.trim();
    }
    static calcDataTableHeight(decreaseTableHeight) {
        return ($(window).innerHeight() - 150) - decreaseTableHeight;
    };

    static OpenModal(mthis) {
        let id = $(mthis).data('id');
        let target = $(mthis).data('target');
        $('#' + target).modal('show');
        if (id == 0) {
            Common.BindValuesToOrderForm(new Order(0, null, null, null, null, null, null));
        }
        else {
            Common.GetOrderById(id);
        }
    }
    static OpenActionModal(mthis) {
        let id = $(mthis).data('id');
        $('#ReceivedOrCancelledOrder').modal('show');
        let rowData = orderGridOptions.api.getRowNode(id).data;
        $('#ActionOrderId').val(rowData.id);
        $('#ActionProductId').val(rowData.productId);
        $('#ActionProductName').html(rowData.productName);
        $('#ActionQuantity').val(rowData.quantity);
        $('#ActionPaymentTypeId').val(rowData.paymentTypeId).trigger('change');
        $('#ActionPayerId').val(rowData.payerId).trigger('change');
        $('#ActionPaidAmount').val(rowData.paidAmount);
        $('#ActionOrderDate').val(moment(rowData.orderDate).format("YYYY-MM-DD"));
        $('#ActionReceivedQuantity').val(rowData.quantity);
        $('#ActionReceivedDate').val(moment().format("YYYY-MM-DD"));
        $('#ActionRemark').val(rowData.remark);
    }

    static ApplyAGGrid() {

        var gridDiv = document.querySelector('#ordersdata');
        new agGrid.Grid(gridDiv, orderGridOptions);
        fetch(baseUrl + 'api/orders')
            .then((response) => response.json())
            .then(data => {
                orderGridOptions.api.setRowData(data);
            })
            .catch(error => {
                orderGridOptions.api.setRowData([])
                //toastr.error(error, '', {
                //    positionClass: 'toast-top-center'
                //});
            });

    }

    static BindValuesToOrderForm(model) {
        $('#OrderErrorSection').empty();
        $('#Id').val(model.Id);
        $('#ProductId').val(model.ProductId).trigger('change');
        $('#Quantity').val(model.Quantity);
        $('#OrderDate').val(moment(model.OrderDate).format("YYYY-MM-DD"));
        $('#Remark').val(model.Remark);
        $('#ReceivedQuantity').val(model.ReceivedQuantity);
        $('#ReceivedDate').val(model.ReceivedDate);
        if (model.OrderTransaction.length == 0) {
            $('#OrderTransactionBody').html("<tr><td colspan='4' class='text-center alert alert-info'>Transaction(s) will be apprear here.</td></tr>");
        }
        else {
            orderTransaction = model.OrderTransaction;
            UpdateOrderTransactionGrid();
        }
    }

    static init() {
        $('#ordersdata').height(Common.calcDataTableHeight(27));
        $('.select2').select2({
            dropdownParent: $('#PlaceOrder'),
            placeholder: 'Search option',
            theme: "bootstrap4",
            allowClear: true
        });
        //$('.actionselect2').select2({
        //    dropdownParent: $('#ReceivedOrCancelledOrder'),
        //    placeholder: 'Search option',
        //    closeOnSelect: true,
        //    allowClear: true
        //});
    }

    static async SaveOrder(mthis) {
        $('#OrderErrorSection').empty();
        let Id = $('#Id').val();
        let ProductId = $('#ProductId').val();
        let Quantity = $('#Quantity').val();
        let PaymentTypeId = $('#PaymentTypeId').val();
        let PayerId = $('#PayerId').val();
        let PaidAmount = $('#PaidAmount').val();
        let OrderDate = $('#OrderDate').val();
        let Remark = $('#Remark').val();
        let order = new Order(Id, ProductId, Quantity, PaymentTypeId, PayerId, PaidAmount, OrderDate, Remark, null, null);

        var response = await fetch(baseUrl + 'api/order/save', {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => { return response.json() });
        if (response.status > 399 && response.status < 500) {
            if (response != null) {
                var errorHtml = "";
                $.each(response.errors, function (index, element) {
                    errorHtml += element[0] + '<br/>';
                });
                $('#OrderErrorSection').html(errorHtml);
            }
        }
        if (response.success) {
            toastr.success("Order Saved", '', { positionClass: 'toast-top-center' });
            let target = $(mthis).data('target');
            $('#' + target).modal('hide');
            if (Id == 0) {
                orderGridOptions.api.applyTransaction({ add: [response.data] });//addIndex
            }
            else {
                orderGridOptions.api.applyTransaction({ update: [response.data] });
            }
            let rowNode = orderGridOptions.api.getRowNode(response.data.id);
            orderGridOptions.api.flashCells({ rowNodes: [rowNode] });
        }
        if (response.success == false) {
            var errorHtml = "";
            $.each(response.errors, function (index, element) {
                errorHtml += element[0].errorMessage + '<br/>';
            });
            $('#OrderErrorSection').html(errorHtml);
        }
    }
    static async GetOrderById(id) {
        await fetch(baseUrl + 'api/order/byid/' + id, {
            method: 'GET',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => { return response.json() })
            .then(data => {
                var order = new Order(data.id, data.productId, data.quantity, data.orderDate, data.remark);
                order.OrderTransaction = data.OrderTransactionVMs;
                Common.BindValuesToOrderForm(order);
            })
            .catch(error => {
                console.log(error);
                toastr.success("Unexpected error", '', { positionClass: 'toast-top-center' });
            });
    }

    static async ReceiveOrder(mthis) {
        $('#ActionErrorSection').empty();
        let Id = $('#ActionOrderId').val();
        let ProductId = $('#ActionProductId').val();
        let Quantity = $('#ActionQuantity').val();
        let PaymentTypeId = $('#ActionPaymentTypeId').val();
        let PayerId = $('#ActionPayerId').val();
        let PaidAmount = $('#ActionPaidAmount').val();
        let OrderDate = $('#ActionOrderDate').val();
        let Remark = $('#ActionRemark').val();
        let ReceivedQuantity = $('#ActionReceivedQuantity').val();
        let ReceivedDate = $('#ActionReceivedDate').val();
        let order = new Order(Id, ProductId, Quantity, PaymentTypeId, PayerId, PaidAmount, OrderDate, Remark, ReceivedQuantity, ReceivedDate);

        var response = await fetch(baseUrl + 'api/order/receive', {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => { return response.json() });
        if (response.status > 399 && response.status < 500) {
            if (response != null) {
                var errorHtml = "";
                $.each(response.errors, function (index, element) {
                    errorHtml += element[0] + '<br/>';
                });
                $('#ActionErrorSection').html(errorHtml);
            }
        }
        if (response.success) {
            toastr.success("Order has been received", '', { positionClass: 'toast-top-center' });
            let target = $(mthis).data('target');
            $('#' + target).modal('hide');

            orderGridOptions.api.applyTransaction({ update: [response.data] });
            let rowNode = orderGridOptions.api.getRowNode(response.data.id);
            orderGridOptions.api.flashCells({ rowNodes: [rowNode] });
        }
        if (response.success == false) {
            var errorHtml = "";
            $.each(response.errors, function (index, element) {
                errorHtml += element[0].errorMessage + '<br/>';
            });
            $('#ActionErrorSection').html(errorHtml);
        }
    }
    static async CancelOrder(mthis) {
        $('#ActionErrorSection').empty();
        let orderId = $('#ActionOrderId').val();
        var response = await fetch(baseUrl + 'api/order/cancel', {
            method: 'POST',
            body: JSON.stringify(orderId),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => { return response.json() });
        if (response.status > 399 && response.status < 500) {
            if (response != null) {
                var errorHtml = "";
                $.each(response.errors, function (index, element) {
                    errorHtml += element[0] + '<br/>';
                });
                $('#ActionErrorSection').html(errorHtml);
            }
        }
        if (response.success) {
            toastr.success("Order has been cancelled", '', { positionClass: 'toast-top-center' });
            let target = $(mthis).data('target');
            $('#' + target).modal('hide');

            orderGridOptions.api.applyTransaction({ update: [response.data] });
            let rowNode = orderGridOptions.api.getRowNode(response.data.id);
            orderGridOptions.api.flashCells({ rowNodes: [rowNode] });
        }
        if (response.success == false) {
            var errorHtml = "";
            $.each(response.errors, function (index, element) {
                errorHtml += element[0].errorMessage + '<br/>';
            });
            $('#ActionErrorSection').html(errorHtml);
        }
    }

    static async AddOrderTransaction(mthis) {
        let PartyId = $('#PartyId').val();
        let PaymentTypeId = $('#PaymentTypeId').val();
        let PaidAmount = $('#PaidAmount').val();
        if (orderTransaction.length == 0) {
            $('#OrderTransactionBody').empty();
        }
        orderTransaction.push(new OrderTransaction(0, PartyId, PaymentTypeId, PaidAmount));
        let PartyIdText = $('#PartyId').val();
        let PaymentTypeIdText = $('#PaymentTypeId').val();
        let actionBtn = '<button class="btn btn-sm btn-outline-primary">Edit</button><button class="btn btn-sm btn-outline-danger">Delete</button>';
        let template = "<tr id='{idx}'><td>{PartyIdText}</td><td>{PaymentTypeIdText}</td><td>{PaidAmount}</td><td>{actionBtn}</td></tr>";
        $('#OrderTransactionBody').append(template.replace("{PartyIdText}", PartyIdText).replace("{PaymentTypeIdText}", PaymentTypeIdText).replace("{PaidAmount}", PaidAmount).replace("{actionBtn}", actionBtn));
    }
    static async UpdateOrderTransactionGrid() {
        $('#OrderTransactionBody').empty();
        if (orderTransaction.length == 0) {
            $('#OrderTransactionBody').html("<tr><td colspan='4' class='text-center alert alert-info'>Transaction(s) will be apprear here.</td></tr>");
        }
        else {
            $.each(orderTransaction, function (i, v) {

            });
        }
    }
}

jQuery(document).ready(function () {
    Common.init();
    Common.ApplyAGGrid();
});