function ActionCellRenderer() { }

ActionCellRenderer.prototype.init = function (params) {
    this.params = params;

    this.eGui = document.createElement('span');
    this.eGui.innerHTML = '<button class="btn btn-sm btn-link" type="button" onclick="Common.OpenModal(this)" data-id="' + params.data.id + '" data-target="AddEditProduct">Edit</button>';
}

ActionCellRenderer.prototype.getGui = function () {
    return this.eGui;
}
function onCellClickedEvent(params) {
    $('#ProductUsageSelect').val(params.data.id);
    $('#ProductUsageSelect').trigger('change');
    //$('#UsageQuantity').focus();
}
const stockClassRules = {
    'sick-days-warning': (params) => params.data.currentStock < params.data.reorderLevel
};
var productGridOptions = {

    // define grid columns
    columnDefs: [
        {
            headerName: 'Name', field: 'name', filter: 'agTextColumnFilter', headerTooltip: 'Name'
        },
        {
            headerName: 'Company', field: 'company', filter: 'agTextColumnFilter', headerTooltip: 'Company'
        },
        {
            headerName: 'Description', field: 'description', filter: 'agTextColumnFilter', headerTooltip: 'Description'
        },
        {
            headerName: 'Size & Unit', field: 'sizeUnitTypeCode', filter: 'agTextColumnFilter', headerTooltip: 'Size & Unit'
        },
        {
            headerName: 'Current Stock', field: 'currentStock', filter: 'agNumberColumnFilter', headerTooltip: 'Storage'
            , cellClassRules: stockClassRules
        },
        {
            headerName: 'Reorder Level',
            field: 'reorderLevel', filter: 'agNumberColumnFilter', headerTooltip: 'Reorder Level'
        },
        {
            headerName: 'Is Disposable?', field: 'disposable', filter: 'agSetColumnFilter', headerTooltip: 'Is Disposable'
        },        
        {
            headerName: 'Storage', field: 'storageNames', filter: 'agTextColumnFilter', headerTooltip: 'Storage'
        },
        {
            headerName: '', field: 'id', headerTooltip: 'Action', pinned: 'right', width: 80, suppressSizeToFit: true,
            cellRenderer: 'actionCellRenderer',
        }
    ],
    sideBar: { toolPanels: ['columns', 'filters'] },
    //rowClassRules: {
    //    'sick-days-warning': function (params) {
    //        return params.data.currentStock < params.data.reorderLevel;
    //    },
    //},
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
    animateRows: true,
    rowSelection: 'single',
    pagination: true,
    paginationAutoPageSize: true,
    animateRows: true,
    defaultColGroupDef: {
        marryChildren: true
    },
    onCellClicked: onCellClickedEvent,
    //onSelectionChanged: onSelectionChanged,
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
        productGridOptions.api.sizeColumnsToFit();
        //const allColumnIds = [];
        //productGridOptions.columnApi.getAllColumns().forEach((column) => {
        //    if (column.colId != 'id')
        //        allColumnIds.push(column.colId);
        //});
        //productGridOptions.columnApi.autoSizeColumns(allColumnIds, false);
    },
    overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center">Please wait while your products are loading</span>',
    overlayNoRowsTemplate:
        `<div class="text-center">
                <h5 class="text-center"><b>Product(s) will appear here.</b></h5>
            </div>`
};


class Product {
    constructor(Id, Name, Description, Size, UnitTypeCode, ReorderLevel, IsDisposable, Company, StorageNames) {
        this.Id = parseInt(Id);
        this.Name = Common.ParseValue(Name);
        this.Description = Common.ParseValue(Description);
        this.Size = Size;
        this.UnitTypeCode = Common.ParseValue(UnitTypeCode);
        this.ReorderLevel = ReorderLevel;
        this.IsDisposable = IsDisposable;
        this.Company = Common.ParseValue(Company);
        //this.StorageId = StorageId;
        this.StorageNames = StorageNames;
    }
}
class ProductUsageModel {
    constructor(ProductId, Quantity, Buyer) {
        this.ProductId = ProductId;
        this.Quantity = Quantity
        this.Buyer = Buyer;
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
            $('#ModalTitle').html('Add Product');
            Common.BindValuesToProductForm(new Product(0, null, null, null, null, null, null, null, null));
        }
        else {
            $('#ModalTitle').html('Edit Product');
            Common.GetProductById(id);
        }
    }

    static ApplyAGGrid() {

        var gridDiv = document.querySelector('#productsdata');
        new agGrid.Grid(gridDiv, productGridOptions);
        fetch(baseUrl + 'api/products')
            .then((response) => response.json())
            .then(data => {
                productGridOptions.api.setRowData(data);
                Common.InitSelect2();
            })
            .catch(error => {
                productGridOptions.api.setRowData([])
                //toastr.error(error, '', {
                //    positionClass: 'toast-top-center'
                //});
            });

    }

    static BindValuesToProductForm(model) {
        $('#ProductErrorSection').empty();
        $('#Id').val(model.Id);
        $('#Name').val(model.Name);
        $('#Description').val(model.Description);
        $('#Size').val(model.Size);
        $('#UnitTypeCode').val(model.UnitTypeCode);
        $('#ReorderLevel').val(model.ReorderLevel);
        $('#IsDisposable').prop("checked", model.IsDisposable);
        $('#Company').val(model.Company);
        if (model.StorageNames != null) {
            $('#StorageNames').val(model.StorageNames.split(',')).trigger('change');
        }
        else {
            $('#StorageNames').val('').trigger('change');
        }
    }

    static init() {
        $('#productsdata').height(Common.calcDataTableHeight(27));
    }

    static async SaveProduct(mthis) {
        $('#ProductErrorSection').empty();
        let Id = $('#Id').val();
        let Name = $('#Name').val();
        let Description = $('#Description').val();
        let Size = $('#Size').val();
        let UnitTypeCode = $('#UnitTypeCode').val();
        let ReorderLevel = $('#ReorderLevel').val();
        let IsDisposable = $('#IsDisposable').is(':checked');
        let Company = $('#Company').val();
        let StorageNames = $('#StorageNames option:selected').toArray().map(item => item.text).join();
        let product = new Product(Id, Name, Description, Size, UnitTypeCode, ReorderLevel, IsDisposable, Company, StorageNames);

        var response = await fetch(baseUrl + 'api/product/save', {
            method: 'POST',
            body: JSON.stringify(product),
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
                $('#ProductErrorSection').html(errorHtml);
            }
        }
        if (response.success) {
            toastr.success("Product Saved", '', { positionClass: 'toast-top-center' });
            let target = $(mthis).data('target');
            $('#' + target).modal('hide');
            if (Id == 0) {
                productGridOptions.api.applyTransaction({ add: [response.data] });//addIndex
            }
            else {
                productGridOptions.api.applyTransaction({ update: [response.data] });
            }
            let rowNode = productGridOptions.api.getRowNode(response.data.id);
            productGridOptions.api.flashCells({ rowNodes: [rowNode] });
            $("#ProductUsageSelect").select2('destroy').empty();
            setTimeout(function () {
                Common.InitSelect2();
            }, 1000);
        }
    }
    static async GetProductById(id) {
        await fetch(baseUrl + 'api/product/byid/' + id, {
            method: 'GET',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => { return response.json() })
            .then(data => {
                console.log('data:',data);
                Common.BindValuesToProductForm(new Product(data.id, data.name, data.description, data.size, data.unitTypeCode, data.reorderLevel, data.isDisposable, data.company, data.storageIds));
            })
            .catch(error => {
                console.log(error);
                toastr.success("Unexpected error", '', { positionClass: 'toast-top-center' });
            });
    }

    static BindSelectData() {
        var result = [];
        result.push({ id: '', text: '' });
        productGridOptions.api.forEachNode((rowNode, index) => {
            result.push({ id: rowNode.data.id, text: rowNode.data.name });
        });
        return result;
    }
    static async InitSelect2() {
        $('#ProductUsageSelect').select2({
            placeholder: 'Search Product',
            //minimumInputLength: 1,
            //maximumSelectionLength: 1,
            //minimumResultsForSearch: 10,
            theme: "bootstrap4",
            data: Common.BindSelectData(),
            closeOnSelect: true,
            //allowClear: true
        });
        $('#BuyersSelect').select2({
            placeholder: 'Search Buyer',
            theme: "bootstrap4",
            closeOnSelect: true,
            tags: true
        });
        $('#StorageNames').select2({
            dropdownParent: $('#AddEditProduct'),
            placeholder: 'Search Storage',
            //theme: "bootstrap4",
            closeOnSelect: true,
            tags: true
        });

        $(document).on('select2:open', () => {
            document.querySelector('.select2-search__field').focus();
        });
    }

    static async UseProduct(mthis) {
        let productId = $('#ProductUsageSelect').val();
        let quantity = $('#UsageQuantity').val();
        let Buyer = $('#BuyersSelect').val();
        var productUsageModel = new ProductUsageModel(productId[0], quantity, Buyer);
        var response = await fetch(baseUrl + 'api/product/usage', {
            method: 'POST',
            body: JSON.stringify(productUsageModel),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => { return response.json() });
        if (response.status > 399 && response.status < 500) {
            if (response != null) {
                var errorHtml = "";
                $.each(response.errors, function (index, element) {
                    errorHtml += element[0] + '.';
                });
                toastr.error(errorHtml, '', { positionClass: 'toast-top-center' });
            }
        }
        if (response.success) {
            toastr.success("Saved", '', { positionClass: 'toast-top-center' });
            productGridOptions.api.applyTransaction({ update: [response.data] });
            let rowNode = productGridOptions.api.getRowNode(response.data.id);
            productGridOptions.api.flashCells({ rowNodes: [rowNode] });

            $('#ProductUsageSelect').val('').trigger('change');
            $('#UsageQuantity').val('');
            $('#BuyersSelect').val('').trigger('change');
            $('#ProductUsageSelect').select2('open');
            $('.select2-search__field').focus();
        }
        if (response.success == false) {

            toastr.error(response.errors, '', { positionClass: 'toast-top-center' });
        }
    }

    static async ExportToExcel() {
        productGridOptions.api.exportDataAsExcel({ fileName: 'Products.xlsx' });
    }
}

jQuery(document).ready(function () {
    Common.init();
    Common.ApplyAGGrid();
});