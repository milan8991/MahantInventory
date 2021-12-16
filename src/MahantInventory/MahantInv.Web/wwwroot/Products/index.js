class Product {
    constructor(Id, Name, Description, Size, UnitTypeCode, ReorderLevel, IsDisposable, Company, StorageId) {
        this.Id = parseInt(Id);
        this.Name = Common.ParseValue(Name);
        this.Description = Common.ParseValue(Description);
        this.Size = Common.ParseValue(Size);
        this.UnitTypeCode = Common.ParseValue(UnitTypeCode);
        this.ReorderLevel = ReorderLevel;
        this.IsDisposable = IsDisposable;
        this.Company = Common.ParseValue(Company);
        this.StorageId = Common.ParseValue(StorageId);
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
        let target = $(mthis).data('target');
        $('#' + target).modal('show');
        Common.BindValuesToProductForm(new Product(0, null, null, null, null, null, null, null, null));
    }

    static ApplyAGGrid() {
        var gridOptions = {

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
                    headerName: 'Unit Type', field: 'unitTypeCode', filter: 'agTextColumnFilter', headerTooltip: 'Unit Type'
                },
                {
                    headerName: 'Reorder Level',
                    field: 'reorderLevel', filter: 'agNumberColumnFilter', headerTooltip: 'Reorder Level'
                },
                {
                    headerName: 'Is Disposable', field: 'isDisposable', filter: 'agSetColumnFilter', headerTooltip: 'Is Disposable'
                },
                {
                    headerName: 'Company', field: 'company', filter: 'agTextColumnFilter', headerTooltip: 'Company'
                },
                {
                    headerName: 'Storage', field: 'storage', filter: 'agTextColumnFilter', headerTooltip: 'Storage'
                },
                {
                    headerName: 'Last Modified By', field: 'lastModifiedById', filter: 'agTextColumnFilter', headerTooltip: 'Last Modified By'
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
            suppressContextMenu: true,
            components: {

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
        var gridDiv = document.querySelector('#productsdata');
        new agGrid.Grid(gridDiv, gridOptions);
        fetch(baseUrl + 'api/products')
            //.then(handleErrors)
            .then(data => {
                gridOptions.api.setRowData(data);
            })
            .catch(error => {
                gridOptions.api.setRowData([])
                //toastr.error(error, '', {
                //    positionClass: 'toast-top-center'
                //});
            });
    }

    static BindValuesToProductForm(model) {
        $('#Id').val(model.Id);
        $('#Name').val(model.Name);
        $('#Description').val(model.Description);
        $('#Size').val(model.Size);
        $('#UnitTypeCode').val(model.UnitTypeCode);
        $('#ReorderLevel').val(model.ReorderLevel);
        $('#IsDisposable').val(model.IsDisposable);
        $('#Company').val(model.Company);
        $('#StorageId').val(model.StorageId);
    }

    static init() {
        $('#productsdata').height(Common.calcDataTableHeight(27));
    }

    static async SaveProduct() {
        $('#ProductErrorSection').empty();
        let Id = $('#Id').val();
        let Name = $('#Name').val();
        let Description = $('#Description').val();
        let Size = $('#Size').val();
        let UnitTypeCode = $('#UnitTypeCode').val();
        let ReorderLevel = $('#ReorderLevel').val();
        let IsDisposable = false;//$('#IsDisposable').val();
        let Company = $('#Company').val();
        let StorageId = $('#StorageId').val();
        let product = new Product(Id, Name, Description, Size, UnitTypeCode, ReorderLevel, IsDisposable, Company, StorageId);
        
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
        if (response.ok) {
            toastr.success("Product Saved");
        }
    }

}

jQuery(document).ready(function () {
    Common.init();
    Common.ApplyAGGrid();
});