var orderTransaction = [];
let editModeIdx = -1;
function ActionCellRenderer() { }

ActionCellRenderer.prototype.init = function (params) {
    var cellBlank = !params.value;
    if (cellBlank) {
        return null;
    }
    this.params = params;

    this.eGui = document.createElement('div');
    if (params.data.status != 'Ordered') {
        this.eGui.innerHTML = '<button class="btn btn-sm btn-link" type="button" onclick="Common.OpenModal(this)" data-id="' + params.data.id + '" data-target="PlaceOrder">View</button>';
    }
    else {
        this.eGui.innerHTML = '<button class="btn btn-sm btn-link" type="button" onclick="Common.OpenModal(this)" data-id="' + params.data.id + '" data-target="PlaceOrder">Edit</button>';
    }
}

ActionCellRenderer.prototype.getGui = function () {
    return this.eGui;
}
const stockClassRules = {
    'sick-days-warning': (params) => params.data.currentStock < params.data.reorderLevel
};

const spanCellClassRules = {
    'cell-span': (params) => params.data.orderTransactionsCount > 1
};

var orderGridOptions = {

    // define grid columns
    columnDefs: [
        {
            headerName: 'Product', field: 'productName', filter: 'agTextColumnFilter', headerTooltip: 'Name'
            , rowSpan: function (params) {
                return params.data.orderTransactionsCount;
            }
            , cellClassRules: spanCellClassRules
        },
        {
            headerName: 'Quantity', field: 'quantity', filter: 'agNumberColumnFilter', headerTooltip: 'Ordered Quantity'
            , rowSpan: function (params) {
                return params.data.orderTransactionsCount;
            },
            cellClassRules: spanCellClassRules
        },
        {
            headerName: 'Received Quantity', field: 'receivedQuantity', filter: 'agNumberColumnFilter', headerTooltip: 'Received Quantity'
            , rowSpan: function (params) {
                return params.data.orderTransactionsCount;
            },
            cellClassRules: spanCellClassRules
        },
        {
            headerName: 'Current Stock', field: 'currentStock', filter: 'agNumberColumnFilter', headerTooltip: 'Storage'
            , cellClassRules: stockClassRules
            , rowSpan: function (params) {
                return params.data.orderTransactionsCount;
            },
            cellClassRules: spanCellClassRules
        },
        {
            headerName: 'Reorder Level', field: 'reorderLevel', filter: 'agNumberColumnFilter', headerTooltip: 'Reorder Level',
            rowSpan: function (params) {
                return params.data.orderTransactionsCount;
            },
            cellClassRules: spanCellClassRules
        },
        {
            headerName: 'Seller', field: 'seller', filter: 'agTextColumnFilter', headerTooltip: 'Seller',
            rowSpan: function (params) {
                return params.data.orderTransactionsCount;
            },
            cellClassRules: spanCellClassRules
        },
        {
            headerName: 'Status', field: 'status', filter: 'agSetColumnFilter', headerTooltip: 'Status',
            cellRenderer: function (params) {
                if (params.value == 'Ordered') {
                    return '<button type="button" class="btn btn-link btn-sm" onclick="Common.OpenModal(this)" data-id="' + params.data.id + '" data-target="PlaceOrder">' + params.value + '</button>'
                }

                let cls = params.value == 'Received' ? 'success' : 'danger';
                return '<span class="badge badge-' + cls + '">' + params.value + '</span>';
            },
            rowSpan: function (params) {
                return params.data.orderTransactionsCount;
            },
            cellClassRules: spanCellClassRules
        },
        {
            headerName: 'Payer', field: 'payer', filter: 'agTextColumnFilter', headerTooltip: 'Payer'
        },
        {
            headerName: 'Paid Amount', field: 'amount', filter: 'agNumberColumnFilter', headerTooltip: 'Paid Amount'
        },
        {
            headerName: 'Payment Type',
            field: 'paymentType', filter: 'agSetColumnFilter', headerTooltip: 'Payment Type'
        },
        {
            headerName: 'Order Date', field: 'orderDateFormat', filter: 'agDateColumnFilter', headerTooltip: 'Order Date'
            , rowSpan: function (params) {
                return params.data.orderTransactionsCount;
            }
            , cellClassRules: spanCellClassRules
        },
        {
            headerName: 'Received Date', field: 'receivedDateFormat', filter: 'agDateColumnFilter', headerTooltip: 'Received Date',
            rowSpan: function (params) {
                return params.data.orderTransactionsCount;
            },
            cellClassRules: spanCellClassRules
        },
        //{
        //    headerName: 'Remark', field: 'remark', filter: 'agTextColumnFilter', headerTooltip: 'Remark', minWidth: 100
        //},
        {
            headerName: '', field: 'id', headerTooltip: 'Action'
            , pinned: 'right',
            width: 80, suppressSizeToFit: true,
            cellRenderer: 'actionCellRenderer',
            rowSpan: function (params) {
                return params.data.orderTransactionsCount;
            },
            cellClassRules: spanCellClassRules
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
        wrapText: false,
        //autoHeight: true,
        floatingFilter: true,
    },
    suppressRowTransform: true,
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
    constructor(Id, ProductId, Quantity, SellerId, OrderDate, Remark, ReceivedQuantity, ReceivedDate, PricePerItem, Discount, Tax, DiscountAmount, NetAmount) {
        this.Id = parseInt(Id);
        this.ProductId = ProductId;
        this.Quantity = Quantity;
        this.SellerId = SellerId;
        this.OrderDate = OrderDate;
        this.Remark = Common.ParseValue(Remark);
        this.ReceivedQuantity = ReceivedQuantity;
        this.ReceivedDate = ReceivedDate;
        this.OrderTransactions = [];
        this.PricePerItem = PricePerItem;
        this.Discount = Discount;
        this.Tax = Tax;
        this.DiscountAmount = DiscountAmount;
        this.NetAmount = NetAmount;
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
class Party {
    constructor(Id, Name, Type, CategoryId, PrimaryContact, SecondaryContact, Line1, Line2, Taluk, District, State, Country) {
        this.Id = parseInt(Id);
        this.Name = Common.ParseValue(Name);
        this.Type = Common.ParseValue(Type);
        this.CategoryId = CategoryId;
        this.PrimaryContact = Common.ParseValue(PrimaryContact);
        this.SecondaryContact = Common.ParseValue(SecondaryContact);
        this.Line1 = Common.ParseValue(Line1);
        this.Line2 = Common.ParseValue(Line2);
        this.Taluk = Common.ParseValue(Taluk);
        this.District = Common.ParseValue(District);
        this.State = Common.ParseValue(State);
        this.Country = Common.ParseValue(Country);
    }
}
class DiscountAndNetPay {
    constructor(DiscountAmount, NetAmount) {
        this.DiscountAmount = DiscountAmount;
        this.NetAmount = NetAmount;
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
        editModeIdx = -1;
        orderTransaction = [];
        if (id == 0) {
            Common.BindValuesToOrderForm(new Order(0, null, null, null, null, null, null, null, null, null, null, null, null));
        }
        else {
            Common.GetOrderById(id);
        }
    }
    static OpenPartyModal(mthis) {
        $('#AddParty').modal('show');
    }
    static OpenActionModal(mthis) {
        let id = $(mthis).data('id');
        $('#ReceivedOrCancelledOrder').modal('show');
        let rowData = orderGridOptions.api.getRowNode(id).data;
        $('#OrderId').val(rowData.id);
        $('#ProductId').val(rowData.productId);
        $('#ProductName').html(rowData.productName);
        $('#Quantity').val(rowData.quantity);
        $('#PaymentTypeId').val(rowData.paymentTypeId).trigger('change');
        $('#PayerId').val(rowData.payerId).trigger('change');
        $('#PaidAmount').val(rowData.paidAmount);
        $('#OrderDate').val(moment(rowData.orderDate).format("YYYY-MM-DD"));
        $('#ReceivedQuantity').val(rowData.quantity);
        $('#ReceivedDate').val(moment().format("YYYY-MM-DD"));
        $('#Remark').val(rowData.remark);
    }

    static ApplyAGGrid() {
        var gridDiv = document.querySelector('#ordersdata');
        new agGrid.Grid(gridDiv, orderGridOptions);
    }

    static LoadDataInGrid(startDate, endDate) {
        console.log('startDate, endDate:', startDate, endDate);
        fetch(baseUrl + 'api/orders', {
            method: 'POST',
            body: JSON.stringify({ startDate: startDate, endDate: endDate }),
            headers: {
            //'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
            .then((response) => response.json())
            .then(data => {
        var gridData = [];
        $.each(data, function (i, v) {
            if (v.orderTransactionVMs == null || v.orderTransactionVMs.length == 0) {
                var gData = {};
                gData.orderTransactionsCount = v.orderTransactionsCount;
                gData.productName = v.productName;
                gData.orderDateFormat = v.orderDateFormat;
                gData.id = v.id;
                gData.receivedDateFormat = v.receivedDateFormat;
                gData.orderDateFormat = v.orderDateFormat;
                gData.status = v.status;
                gData.seller = v.seller;
                gData.reorderLevel = v.reorderLevel;
                gData.currentStock = v.currentStock;
                gData.receivedQuantity = v.receivedQuantity;
                gData.quantity = v.quantity;
                gridData.push(gData);
            }
            else {
                let idx = 0;
                $.each(v.orderTransactionVMs, function (oti, otv) {
                    var gData = { payer: otv.party, paymentType: otv.paymentType, amount: otv.amount, orderTransactionsCount: 1 };
                    if (idx == 0) {
                        gData.orderTransactionsCount = v.orderTransactionsCount;
                        gData.productName = v.productName;
                        gData.orderDateFormat = v.orderDateFormat;
                        gData.id = v.id;
                        gData.receivedDateFormat = v.receivedDateFormat;
                        gData.orderDateFormat = v.orderDateFormat;
                        gData.status = v.status;
                        gData.seller = v.seller;
                        gData.reorderLevel = v.reorderLevel;
                        gData.currentStock = v.currentStock;
                        gData.receivedQuantity = v.receivedQuantity;
                        gData.quantity = v.quantity;
                    }
                    gridData.push(gData);
                    idx++;
                });
            }
        });
        orderGridOptions.api.setRowData(gridData);
    })
    .catch(error => {
        console.log('error:', error);
        orderGridOptions.api.setRowData([])
        //toastr.error(error, '', {
        //    positionClass: 'toast-top-center'
        //});
    });
    }

    static BindValuesToOrderForm(model) {
    //console.log('model:', model);
    $('#OrderErrorSection').empty();
    $('#Id').val(model.Id);
    $('#ProductId').val(model.ProductId).trigger('change');
    $('#Quantity').val(model.Quantity);
    $('#SellerId').val(model.ProductId).trigger('change');
    $('#OrderDate').val(moment(model.OrderDate).format("YYYY-MM-DD"));
    $('#Remark').val(model.Remark);
    $('#ReceivedQuantity').val(model.ReceivedQuantity);
    $('#ReceivedDate').val(moment(model.ReceivedDate).format("YYYY-MM-DD"));
    $('#PricePerItem').val(model.PricePerItem);
    $('#Discount').val(model.Discount);
    $('#Tax').val(model.Tax);
    $('#DiscountAmount').val(model.DiscountAmount);
    $('#NetAmount').val(model.NetAmount);
    if (model.OrderTransactions.length == 0) {
        $('#OrderTransactionBody').html("<tr><td colspan='4' class='text-center alert alert-info'>Transaction(s) will be appear here.</td></tr>");
    }
    else {
        orderTransaction = model.OrderTransactions;
        Common.UpdateOrderTransactionGrid();
    }
}
    static BindSelectData() {
    var result = ',India,Afghanistan,Aland Islands,Albania,Algeria,American Samoa,Andorra,Angola,Anguilla,Antarctica,Antigua and Barbuda,Argentina,Armenia,Aruba,Australia,Austria,Azerbaijan,Bahamas,Bahrain,Bangladesh,Barbados,Belarus,Belgium,Belize,Benin,Bermuda,Bhutan,Bolivia,Bosnia and Herzegovina,Botswana,Bouvet Island,Brazil,British Indian Ocean Territory,British Virgin Islands,Brunei,Bulgaria,Burkina Faso,Burundi,Cambodia,Cameroon,Canada,Cape Verde,Caribbean Netherlands,Cayman Islands,Central African Republic,Chad,Chile,China,Christmas Island,Cocos (Keeling) Islands,Colombia,Comoros,Cook Islands,Costa Rica,Croatia,Cuba,Curaçao,Cyprus,Czechia,Denmark,Djibouti,Dominica,Dominican Republic,DR Congo,Ecuador,Egypt,El Salvador,Equatorial Guinea,Eritrea,Estonia,Eswatini,Ethiopia,Falkland Islands,Faroe Islands,Fiji,Finland,France,French Guiana,French Polynesia,French Southern and Antarctic Lands,Gabon,Gambia,Georgia,Germany,Ghana,Gibraltar,Greece,Greenland,Grenada,Guadeloupe,Guam,Guatemala,Guernsey,Guinea,Guinea-Bissau,Guyana,Haiti,Heard Island and McDonald Islands,Honduras,Hong Kong,Hungary,Iceland,Indonesia,Iran,Iraq,Ireland,Isle of Man,Israel,Italy,Ivory Coast,Jamaica,Japan,Jersey,Jordan,Kazakhstan,Kenya,Kiribati,Kosovo,Kuwait,Kyrgyzstan,Laos,Latvia,Lebanon,Lesotho,Liberia,Libya,Liechtenstein,Lithuania,Luxembourg,Macau,Madagascar,Malawi,Malaysia,Maldives,Mali,Malta,Marshall Islands,Martinique,Mauritania,Mauritius,Mayotte,Mexico,Micronesia,Moldova,Monaco,Mongolia,Montenegro,Montserrat,Morocco,Mozambique,Myanmar,Namibia,Nauru,Nepal,Netherlands,New Caledonia,New Zealand,Nicaragua,Niger,Nigeria,Niue,Norfolk Island,North Korea,North Macedonia,Northern Mariana Islands,Norway,Oman,Pakistan,Palau,Palestine,Panama,Papua New Guinea,Paraguay,Peru,Philippines,Pitcairn Islands,Poland,Portugal,Puerto Rico,Qatar,Republic of the Congo,Réunion,Romania,Russia,Rwanda,Saint Barthélemy,Saint Helena, Ascension and Tristan da Cunha,Saint Kitts and Nevis,Saint Lucia,Saint Martin,Saint Pierre and Miquelon,Saint Vincent and the Grenadines,Samoa,San Marino,São Tomé and Príncipe,Saudi Arabia,Senegal,Serbia,Seychelles,Sierra Leone,Singapore,Sint Maarten,Slovakia,Slovenia,Solomon Islands,Somalia,South Africa,South Georgia,South Korea,South Sudan,Spain,Sri Lanka,Sudan,Suriname,Svalbard and Jan Mayen,Sweden,Switzerland,Syria,Taiwan,Tajikistan,Tanzania,Thailand,Timor-Leste,Togo,Tokelau,Tonga,Trinidad and Tobago,Tunisia,Turkey,Turkmenistan,Turks and Caicos Islands,Tuvalu,Uganda,Ukraine,United Arab Emirates,United Kingdom,United States,United States Minor Outlying Islands,United States Virgin Islands,Uruguay,Uzbekistan,Vanuatu,Vatican City,Venezuela,Vietnam,Wallis and Futuna,Western Sahara,Yemen,Zambia,Zimbabwe';
    return result.split(',');
}
    
    static init() {
    $('#ordersdata').height(Common.calcDataTableHeight(27));
    Common.ApplyAGGrid();
    var start = moment().subtract(90, 'days');
    var end = moment();
    Common.LoadDataInGrid(start, end);
    $('#ordersdaterange').daterangepicker({
        opens: 'left',
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, function (start, end) {
        $('#ordersdaterange').val(start.format('D/MM/YYYY') + ' - ' + end.format('D/MM/YYYY'));
        Common.LoadDataInGrid(start, end);
    });

    $('.select2').select2({
        dropdownParent: $('#PlaceOrder'),
        placeholder: 'Search option',
        theme: "bootstrap4",
        allowClear: true
    });
    $('#Country').select2({
        placeholder: 'Search Counry',
        data: Common.BindSelectData(),
        theme: "bootstrap4",
        dropdownParent: $("#AddParty")
    });
    Common.GetAllProducts();
    Common.InitCountable();

    $('#PlaceOrder').find('.modal-dialog').css('max-width', '{v}px'.replace('{v}', ($(window).width() - 100)));
}
    static async GetAllProducts() {
    let response = await fetch(baseUrl + 'api/products', {
        method: 'GET',
        //body: JSON.stringify(order),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(response => { return response.json() });

    $('#ProductId').select2({
        dropdownParent: $('#PlaceOrder'),
        placeholder: 'Search Product',
        closeOnSelect: true,
        allowClear: true,
        data: response,
        templateResult: function (repo) {
            if (repo.loading) {
                return repo.name;
            }
            var $container = $(
                "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__title'></div>" +
                "<div class='select2-result-repository__description'></div>" +
                "<div class='select2-result-repository__statistics'>" +
                "</div>"
            );
            //var $container = $(
            //    "<div class='select2-result-repository clearfix'>" +
            //    "<div class='select2-result-repository__meta'>" +
            //    "<div class='select2-result-repository__title'></div>" +
            //    "<div class='select2-result-repository__description'></div>" +
            //    "<div class='select2-result-repository__statistics'>" +
            //    "<div class='select2-result-repository__forks'></div>" +
            //    "<div class='select2-result-repository__stargazers'></div>" +
            //    "<div class='select2-result-repository__watchers'></div>" +
            //    "</div>" +
            //    "</div>"
            //);

            $container.find(".select2-result-repository__title").text(repo.name);
            let detail = ' Size:' + repo.size + ' Unit: ' + repo.unitTypeCode + ' Company: ' + repo.company;
            $container.find(".select2-result-repository__description").text(repo.description + '' + detail);
            //$container.find(".select2-result-repository__forks").append();
            //$container.find(".select2-result-repository__stargazers").append(" Company:"+repo.company);
            //$container.find(".select2-result-repository__watchers").append(" Unit:"+repo.unitTypeCode);

            return $container;
        },
        templateSelection: function (repo) {
            return repo.name
        }
    });
}

    static async SaveOrder(mthis) {
    $('#OrderErrorSection').empty();
    let order = Common.BuildOrderValues();
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
            orderGridOptions.api.applyTransaction({ add: [response.data] });
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
            var order = new Order(data.id, data.productId, data.quantity, data.sellerId, data.orderDate, data.remark, data.receivedQuantity, data.receivedDate, data.pricePerItem, data.discount, data.tax, data.discountAmount, data.netAmount);
            order.OrderTransactions = [];
            if (data.orderTransactionVMs != null) {
                if (data.orderTransactionVMs.length > 0) {
                    $.each(data.orderTransactionVMs, function (i, v) {
                        order.OrderTransactions.push(new OrderTransaction(v.id, v.partyId, v.party, v.paymentTypeId, v.paymentType, v.amount));
                    });
                }
            }
            Common.BindValuesToOrderForm(order);
            if (data.status != 'Ordered') {
                $('#actionsection').hide();
            }
            else {
                $('#actionsection').show();
            }
        })
        .catch(error => {
            console.log(error);
            toastr.error("Unexpected error", '', { positionClass: 'toast-top-center' });
        });
}
    static BuildOrderValues() {
    let Id = $('#Id').val();
    let ProductId = $('#ProductId').val();
    let Quantity = $('#Quantity').val();
    let SellerId = $('#SellerId').val();
    let OrderDate = $('#OrderDate').val();
    let Remark = $('#Remark').val();
    let ReceivedQuantity = $('#ReceivedQuantity').val();
    let ReceivedDate = $('#ReceivedDate').val();
    let PricePerItem = $('#PricePerItem').val();
    let Discount = $('#Discount').val();
    let Tax = $('#Tax').val();
    let DiscountAmount = $('#DiscountAmount').val();
    let NetAmount = $('#NetAmount').val();
    let order = new Order(Id, ProductId, Quantity, SellerId, OrderDate, Remark, ReceivedQuantity, ReceivedDate, PricePerItem, Discount, Tax, DiscountAmount, NetAmount);
    order.OrderTransactions = orderTransaction;
    return order;
}

    static async ReceiveOrder(mthis) {
    $('#OrderErrorSection').empty();
    let order = Common.BuildOrderValues();
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
            $('#OrderErrorSection').html(errorHtml);
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
        $('#OrderErrorSection').html(errorHtml);
    }
}
    static async CancelOrder(mthis) {
    $('#OrderErrorSection').empty();
    let orderId = $('#Id').val();
    if (!(orderId > 0)) {
        let target = $(mthis).data('target');
        $('#' + target).modal('hide');
        return true;
    }
    let isConfirm = confirm("Are you sure to cancel this Order?");
    if (!isConfirm) {
        let target = $(mthis).data('target');
        $('#' + target).modal('hide');
        return true;
    }
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
            $('#OrderErrorSection').html(errorHtml);
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
        $('#OrderErrorSection').html(errorHtml);
    }
}

    static async AddOrderTransaction(mthis) {
    let PartyId = $('#PartyId').val();
    let PaymentTypeId = $('#PaymentTypeId').val();
    let Amount = $('#Amount').val();

    if (PartyId == null || PartyId == "") {
        toastr.error('Payer field is required', '', {
            positionClass: 'toast-top-center'
        });
        return false;
    }
    if (PaymentTypeId == null || PaymentTypeId == "") {
        toastr.error('Payment Type field is required', '', {
            positionClass: 'toast-top-center'
        });
        return false;
    }
    if (Amount == null || Amount == "") {
        toastr.error('Amount field is required', '', {
            positionClass: 'toast-top-center'
        });
        return false;
    }
    if (Amount <= 0) {
        toastr.error('Amount must be larger than 0', '', {
            positionClass: 'toast-top-center'
        });
        return false;
    }

    let Party = $('#PartyId option:selected').text();
    let PaymentType = $('#PaymentTypeId option:selected').text();
    if (editModeIdx === -1) {
        orderTransaction.push(new OrderTransaction(0, PartyId, Party, PaymentTypeId, PaymentType, Amount));
    } else {
        orderTransaction[editModeIdx].PartyId = PartyId;
        orderTransaction[editModeIdx].Party = Party;
        orderTransaction[editModeIdx].PaymentTypeId = PaymentTypeId;
        orderTransaction[editModeIdx].PaymentType = PaymentType;
        orderTransaction[editModeIdx].Amount = Amount;
        editModeIdx = -1;
    }
    Common.UpdateOrderTransactionGrid();
    Common.ClearSelectionOrderTransaction();
}
    static CancelOrderTransaction(mthis) {
    editModeIdx = -1;
    Common.ClearSelectionOrderTransaction();
}
    static async ClearSelectionOrderTransaction() {
    $('#PartyId').val(null).trigger('change');
    $('#PaymentTypeId').val(null).trigger('change');
    $('#Amount').val(null);
}
    static async UpdateOrderTransactionGrid() {
    $('#OrderTransactionBody').empty();
    if (orderTransaction.length == 0) {
        $('#OrderTransactionBody').html("<tr><td colspan='4' class='text-center alert alert-info'>Transaction(s) will be apprear here.</td></tr>");
    }
    else {
        $.each(orderTransaction, function (i, v) {
            let template = $('#OrderTransactionBodyTemplate').find('tbody').html();
            v.idx = i;
            $('#OrderTransactionBody').prepend(template.supplant(v));
        });
    }
}
    static async EditOrderTransaction(mthis) {
    let idx = $(mthis).parent().parent().attr('id');
    $('#PartyId').val(orderTransaction[idx].PartyId).trigger('change');
    $('#PaymentTypeId').val(orderTransaction[idx].PaymentTypeId).trigger('change');
    $('#Amount').val(orderTransaction[idx].Amount);
    editModeIdx = idx;
}
    static async DeleteOrderTransaction(mthis) {
    let idx = $(mthis).parent().parent().attr('id');
    orderTransaction.splice(idx, 1);
    Common.UpdateOrderTransactionGrid();
}
    static CalculateDiscountAndNetPay() {
    let Quantity = $('#Quantity').val() || 0;
    let PricePerItem = $('#PricePerItem').val() || 0;
    let Discount = $('#Discount').val() || 0;
    let Tax = $('#Tax').val() || 0;
    let TotalAmount = (Quantity * PricePerItem);
    let DiscountAmount = (TotalAmount * Discount) / 100;
    let NetTax = ((TotalAmount - DiscountAmount) * Tax) / 100;
    let NetAmount = (TotalAmount - DiscountAmount) + NetTax;
    return new DiscountAndNetPay(DiscountAmount, NetAmount);
}
    static async InitCountable() {
    $(".countable").on("change", function () {
        var result = Common.CalculateDiscountAndNetPay();
        $('#DiscountAmount').val(result.DiscountAmount);
        $('#NetAmount').val(result.NetAmount);
    });
}
    static async SaveParty(mthis) {
    $('#PartyErrorSection').empty();
    let Name = $('#Name').val();
    let Type = $('#Type').val();
    let CategoryId = $('#CategoryId').val();
    let PrimaryContact = $('#PrimaryContact').val();
    let SecondaryContact = $('#SecondaryContact').val();
    let Line1 = $('#Line1').val();
    let Line2 = $('#Line2').val();
    let Taluk = $('#Taluk').val();
    let District = $('#District').val();
    let State = $('#State').val();
    let Country = $('#Country').val();
    let party = new Party(0, Name, Type, CategoryId, PrimaryContact, SecondaryContact, Line1, Line2, Taluk, District, State, Country);

    var response = await fetch(baseUrl + 'api/party/save', {
        method: 'POST',
        body: JSON.stringify(party),
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
            $('#PartyErrorSection').html(errorHtml);
            return;
        }
    }
    if (response.success) {
        toastr.success("Party Saved", '', { positionClass: 'toast-top-center' });
        if (Type === 'Payer' || Type === 'Both') {
            $('#PartyId').prepend('<option value=' + response.data.id + '>' + response.data.name + '</option>');
        }
        if (Type === 'Seller' || Type === 'Both') {
            $('#SellerId').prepend('<option value=' + response.data.id + '>' + response.data.name + '</option>');
        }
        $('#AddParty').modal('hide');
        return;
    }
    if (response.success == false) {
        var errorHtml = "";
        $.each(response.errors, function (index, element) {
            errorHtml += element + '<br/>';
        });
        $('#PartyErrorSection').html(errorHtml);
    }
}
}

jQuery(document).ready(function () {
    Common.init();
});