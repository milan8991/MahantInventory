function ActionCellRenderer() { }

ActionCellRenderer.prototype.init = function (params) {
    this.params = params;

    this.eGui = document.createElement('span');
    this.eGui.innerHTML = '<button class="btn btn-sm btn-link" type="button" onclick="Common.OpenModal(this)" data-id="' + params.data.id + '" data-target="AddEditStorage">Edit</button>';
}

ActionCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

var storageGridOptions = {

    // define grid columns
    columnDefs: [
        {
            headerName: 'Name', field: 'name', filter: 'agTextColumnFilter', headerTooltip: 'Name'
        },
        {
            headerName: '', field: 'id', headerTooltip: 'Action', pinned: 'right', width: 80, suppressSizeToFit: true,
            cellRenderer: 'actionCellRenderer',
        }
    ],
    sideBar: { toolPanels: ['columns', 'filters'] },
    rowClassRules: {
        'sick-days-warning': function (params) {
            return params.data.currentStock < params.data.reorderLevel;
        },
    },
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
        storageGridOptions.api.sizeColumnsToFit();
    },
    overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center">Please wait while storage(s) are loading</span>',
    overlayNoRowsTemplate:
        `<div class="text-center">
                <h5 class="text-center"><b>Storage(s) will appear here.</b></h5>
            </div>`
};


class Storage {
    constructor(Id, Name) {
        this.Id = parseInt(Id);
        this.Name = Common.ParseValue(Name);
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
            Common.BindValuesToStorageForm(new Storage(0, null));
        }
        else {
            Common.GetStorageById(id);
        }
    }

    static ApplyAGGrid() {

        var gridDiv = document.querySelector('#storagedata');
        new agGrid.Grid(gridDiv, storageGridOptions);
        fetch(baseUrl + 'api/storages')
            .then((response) => response.json())
            .then(data => {
                storageGridOptions.api.setRowData(data);
                Common.InitSelect2();
            })
            .catch(error => {
                storageGridOptions.api.setRowData([])
                //toastr.error(error, '', {
                //    positionClass: 'toast-top-center'
                //});
            });

    }

    static BindValuesToStorageForm(model) {
        $('#StorageErrorSection').empty();
        $('#Id').val(model.Id);
        $('#Name').val(model.Name);
    }

    static init() {
        $('#storagesdata').height(Common.calcDataTableHeight(27));
    }

    static async SaveStorage(mthis) {
        $('#StorageErrorSection').empty();
        let Id = $('#Id').val();
        let Name = $('#Name').val();
        let storage = new Storage(Id, Name);

        var response = await fetch(baseUrl + 'api/storage/save', {
            method: 'POST',
            body: JSON.stringify(storage),
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
                $('#StorageErrorSection').html(errorHtml);
                return;
            }
        }
        if (response.success) {
            toastr.success("Storage Saved", '', { positionClass: 'toast-top-center' });
            let target = $(mthis).data('target');
            $('#' + target).modal('hide');
            if (Id == 0) {
                storageGridOptions.api.applyTransaction({ add: [response.data] });//addIndex
            }
            else {
                storageGridOptions.api.applyTransaction({ update: [response.data] });
            }
            let rowNode = storageGridOptions.api.getRowNode(response.data.id);
            storageGridOptions.api.flashCells({ rowNodes: [rowNode] });
            return;
        }
        if (response.success == false) {
            var errorHtml = "";
            $.each(response.errors, function (index, element) {
                errorHtml += element + '<br/>';
            });
            $('#StorageErrorSection').html(errorHtml);
        }
    }

    static async GetStorageById(id) {
        await fetch(baseUrl + 'api/storage/byid/' + id, {
            method: 'GET',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => { return response.json() })
            .then(data => {
                $('#AddEditStorage').modal('show');
                Common.BindValuesToStorageForm(new Storage(data.id, data.name));
            })
            .catch(error => {
                console.log(error);
                toastr.success("Unexpected error", '', { positionClass: 'toast-top-center' });
            });
    }

    static BindSelectData() {
        // You might want to preload data from the database table here or may be not applicable in our case ?
        var result = 'list of countries';
        return result.split(',');
    }
    static async InitSelect2() {
        $('#Country').select2({
            placeholder: 'Search Country',
            data: Common.BindSelectData(),
            theme: "bootstrap4",
            dropdownParent: $("#AddEditStorage")
        });
    }


}

jQuery(document).ready(function () {
    Common.init();
    Common.ApplyAGGrid();
});