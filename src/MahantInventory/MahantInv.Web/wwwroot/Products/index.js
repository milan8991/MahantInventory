var Product = function () {
    function calcDataTableHeight(decreaseTableHeight) {
        return ($(window).innerHeight() - 150) - decreaseTableHeight;
    };

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
                headerName: 'Company', field: 'company',filter: 'agTextColumnFilter', headerTooltip: 'Company'
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

    function ApplyAGGrid() {
        var gridDiv = document.querySelector('#productsdata');
        new agGrid.Grid(gridDiv, gridOptions);
        fetch(baseUrl + 'api/products')
            //.then(handleErrors)
            .then(data => {
                gridOptions.api.setRowData(data);
            })
            .catch(error => {
                gridOptions.api.setRowData([])
                toastr.error(error, '', {
                    positionClass: 'toast-top-center'
                });
            });
    }


    return {
        init: function () {
            $('#productsdata').height(calcDataTableHeight(63));
            ApplyAGGrid();
        }
    };
}();

jQuery(document).ready(function () {

    Product.init();
});