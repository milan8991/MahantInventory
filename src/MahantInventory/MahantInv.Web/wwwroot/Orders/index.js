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
            headerName: 'Name', field: 'name', filter: 'agTextColumnFilter', headerTooltip: 'Name'
        },
        {
            headerName: 'Description', field: 'description', filter: 'agTextColumnFilter', headerTooltip: 'Description'
        },
        {
            headerName: 'Size', field: 'size', filter: 'agTextColumnFilter', headerTooltip: 'Size'
        },
        {
            headerName: 'Current Stock', field: 'currentStock', filter: 'agNumberColumnFilter', headerTooltip: 'Storage'
        },
        {
            headerName: 'Unit Type', field: 'unitTypeCode', filter: 'agSetColumnFilter', headerTooltip: 'Unit Type'
        },
        {
            headerName: 'Reorder Level',
            field: 'reorderLevel', filter: 'agNumberColumnFilter', headerTooltip: 'Reorder Level'
        },
        {
            headerName: 'Is Disposable?', field: 'disposable', filter: 'agSetColumnFilter', headerTooltip: 'Is Disposable'
        },
        {
            headerName: 'Company', field: 'company', filter: 'agTextColumnFilter', headerTooltip: 'Company'
        },
        {
            headerName: 'Storage', field: 'storage', filter: 'agTextColumnFilter', headerTooltip: 'Storage'
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
        '<span class="ag-overlay-loading-center">Please wait while your products are loading</span>',
    overlayNoRowsTemplate:
        `<div class="text-center">
                <h5 class="text-center"><b>No Products found.</b></h5>
            </div>`
};


class Order {
    constructor(Id, ProductId, Quantity, PaymentTypeId, PayerId, PaidAmount, OrderDate, Remark) {
        this.Id = parseInt(Id);
        this.ProductId = ProductId;
        this.Quantity = Quantity;
        this.PaymentTypeId = PaymentTypeId;
        this.PayerId = PayerId;
        this.PaidAmount = PaidAmount;
        this.IsDisposable = IsDisposable;
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
        $('#Id').val(model.Id);
        $('#ProductId').val(model.ProductId);
        $('#Quantity').val(model.Quantity);
        $('#PaymentTypeId').val(model.PaymentTypeId);
        $('#PayerId').val(model.PayerId);
        $('#PaidAmount').val(model.PaidAmount);
        $('#OrderDate').val(model.OrderDate);
        $('#Remark').val(model.Remark);
    }

    static init() {
        $('#ordersdata').height(Common.calcDataTableHeight(27));
    }

    static async SaveProduct(mthis) {
        $('#OrderErrorSection').empty();
        let Id = $('#Id').val();
        let ProductId = $('#Name').val();
        let Quantity = $('#Description').val();
        let PaymentTypeId = $('#Size').val();
        let PayerId = $('#UnitTypeCode').val();
        let PaidAmount = $('#ReorderLevel').val();
        let OrderDate = $('#Company').val();
        let Remark = $('#StorageId').val();
        let order = new Order(Id, ProductId, Quantity, PaymentTypeId, PayerId, PaidAmount, OrderDate, Remark);

        var response = await fetch(baseUrl + 'api/order/save', {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                //'Accept': 'application/json',
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