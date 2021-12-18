function ActionCellRenderer() { }

ActionCellRenderer.prototype.init = function (params) {
    this.params = params;

    this.eGui = document.createElement('span');
    this.eGui.innerHTML = '<button class="btn btn-sm btn-link" type="button" onclick="Common.OpenModal(this)" data-id="' + params.data.id + '" data-target="AddEditOrder">Edit</button>';
}

ActionCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

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
            headerName: 'Received Quantity', field: 'eeceivedQuantity', filter: 'agNumberColumnFilter', headerTooltip: 'Received Quantity'
        },
        {
            headerName: 'Current Stock', field: 'currentStock', filter: 'agNumberColumnFilter', headerTooltip: 'Storage'
        },
        {
            headerName: 'Status', field: 'status', filter: 'agSetColumnFilter', headerTooltip: 'Status'
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
            headerName: 'Order Date', field: 'orderDate', filter: 'agDateColumnFilter', headerTooltip: 'Order Date'
        },
        {
            headerName: 'Received Date', field: 'receivedDate', filter: 'agDateColumnFilter', headerTooltip: 'Received Date'
        },
        {
            headerName: 'Remark', field: 'remark', filter: 'agTextColumnFilter', headerTooltip: 'Remark'
        },
        {
            headerName: 'Last Modified By', field: 'lastModifiedBy', filter: 'agSetColumnFilter', headerTooltip: 'LastModifiedBy'
        },
        {
            headerName: '', field: 'id', headerTooltip: 'Action',
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
    rowSelection: 'single',
    pagination: true,
    paginationAutoPageSize: true,
    animateRows: true,
    defaultColGroupDef: {
        marryChildren: true
    },

    getRowNodeId: function (data) {
        return data.id;
    },
    suppressContextMenu: true,
    components: {
        actionCellRenderer: ActionCellRenderer
    },
    columnTypes: {
        numberColumn: {
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
        dateColumn: {
            editable: false,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            sortable: true,
            resizable: true,
            flex: 1,
            minWidth: 130,
            wrapText: true,
            autoHeight: true,
            floatingFilter: true,
        }
    },
    onGridReady: function (params) {

    },
    overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center">Please wait while your orders are loading</span>',
    overlayNoRowsTemplate:
        `<div class="text-center">
                <h5 class="text-center"><b>Orders will be appear here.</b></h5>
            </div>`
};


class Order {
    constructor(Id, ProductId, Quantity, PaymentTypeId, PayerId, PaidAmount, OrderDate, Remark) {
        this.Id = parseInt(Id);
        this.ProductId = ProductId;
        this.Quantity = Quantity;
        this.PaymentTypeId = Common.ParseValue(PaymentTypeId);
        this.PayerId = PayerId;
        this.PaidAmount = PaidAmount;
        this.OrderDate = OrderDate;
        this.Remark = Common.ParseValue(Remark);
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
            Common.BindValuesToOrderForm(new Order(0, null, null, null, null, null, null, null));
        }
        else {
            Common.GetOrderById(id);
        }
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
        $('#PaymentTypeId').val(model.PaymentTypeId).trigger('change');
        $('#PayerId').val(model.PayerId).trigger('change');
        $('#PaidAmount').val(model.PaidAmount);
        $('#OrderDate').val(model.OrderDate);
        $('#Remark').val(model.Remark);
    }

    static init() {
        $('#ordersdata').height(Common.calcDataTableHeight(27));
        $('.select2').select2({
            dropdownParent: $('#AddEditOrder'),
            placeholder: 'Search option',
            closeOnSelect: true,
            allowClear: true
        });
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
        let order = new Order(Id, ProductId, Quantity, PaymentTypeId, PayerId, PaidAmount, OrderDate, Remark);

        var response = await fetch(baseUrl + 'api/order/save', {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => { console.log('response:', response); return response.ok ? response.json() : response; });

        if (response.status > 399 && response.status < 500) {
            if (response != null) {
                var errorHtml = "";
                console.log(response);
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
                Common.BindValuesToOrderForm(new Order(data.id, data.productId, data.quantity, data.paymentTypeId, data.payerId, data.paidAmount, data.orderDate, data.remark));
            })
            .catch(error => {
                console.log(error);
                toastr.success("Unexpected error", '', { positionClass: 'toast-top-center' });
            });
    }

    
}

jQuery(document).ready(function () {
    Common.init();
    Common.ApplyAGGrid();
});