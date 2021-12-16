﻿class Product {
    constructor(Id, Name, Description, Size, UnitTypeCode, ReorderLevel, IsDisposable, Company, StorageId) {
        this.Id = parseInt(Id);
        this.Name = Common.ParseValue(Name);
        this.Description = Common.ParseValue(Description);
        this.Size = Size;
        this.UnitTypeCode = Common.ParseValue(UnitTypeCode);
        this.ReorderLevel = ReorderLevel;
        this.IsDisposable = IsDisposable;
        this.Company = Common.ParseValue(Company);
        this.StorageId = StorageId;
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
            Common.BindValuesToProductForm(new Product(0, null, null, null, null, null, null, null, null));
        }
        else {
            Common.GetProductById(id);
        }
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

        function ActionCellRenderer() { }

        ActionCellRenderer.prototype.init = function (params) {
            this.params = params;

            this.eGui = document.createElement('span');
            this.eGui.innerHTML = '<button class="btn btn-sm btn-primary" type="button" onclick="Common.OpenModal(this)" data-id="' + params.data.id + '" data-target="AddEditProduct">Edit</button>';

            //this.btnClickedHandler = this.btnClickedHandler.bind(this);
            //this.eGui.addEventListener('click', this.btnClickedHandler);
        }

        ActionCellRenderer.prototype.getGui = function () {
            return this.eGui;
        }
        //ActionCellRenderer.prototype.destroy = function () {
        //    this.eGui.removeEventListener('click', this.btnClickedHandler);
        //}

        //ActionCellRenderer.prototype.btnClickedHandler = function (event) {
        //    this.params.clicked(this.params.value);
        //}
        var gridDiv = document.querySelector('#productsdata');
        new agGrid.Grid(gridDiv, gridOptions);
        fetch(baseUrl + 'api/products')
            .then((response) => response.json())
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
        $('#IsDisposable').prop("checked", model.IsDisposable);
        $('#Company').val(model.Company);
        $('#StorageId').val(model.StorageId);
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
        let StorageId = $('#StorageId').val();
        let product = new Product(Id, Name, Description, Size, UnitTypeCode, ReorderLevel, IsDisposable, Company, StorageId);

        var response = await fetch(baseUrl + 'api/product/save', {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => { return  response.json() });
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
            toastr.success("Product Saved", '', { positionClass: 'toast-top-center' });
            let target = $(mthis).data('target');
            $('#' + target).modal('hide');
            if (Id == 0) {
                //Add
                gridOptions.api.applyTransaction({ add: response });//addIndex
            }
            else {
                //Update
                gridOptions.api.applyTransaction({ update: response });
            }
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
                Common.BindValuesToProductForm(new Product(data.id, data.name, data.description, data.size, data.unitTypeCode, data.reorderLevel, data.isDisposable, data.company, data.storageId));
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