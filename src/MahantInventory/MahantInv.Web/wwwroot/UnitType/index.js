function ActionCellRenderer() { }

ActionCellRenderer.prototype.init = function (params) {
    this.params = params;

    this.eGui = document.createElement('span');
    this.eGui.innerHTML = '<button class="btn btn-sm btn-link text-red" type="button" onclick="Common.DeleteUnitType(this)" data-code="' + params.data.code + '">Delete</button>';
}

ActionCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

var unitTypeGridOptions = {

    // define grid columns
    columnDefs: [
        {
            headerName: 'Code', field: 'code', filter: 'agTextColumnFilter', headerTooltip: 'code'
        },
        {
            headerName: 'Name', field: 'name', filter: 'agTextColumnFilter', headerTooltip: 'Name'
        },        
        {
            headerName: '', field: '', headerTooltip: 'Action', width: 80, suppressSizeToFit: true,
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
    onGridReady: function (params) {
        unitTypeGridOptions.api.sizeColumnsToFit();
    },
    overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center">Please wait while Unit Type(s) are loading</span>',
    overlayNoRowsTemplate:
        `<div class="text-center">
                <h5 class="text-center"><b>Unit Type(s) will appear here.</b></h5>
            </div>`
};


class UnitType {
    constructor(Code, Name) {
        this.Code = Common.ParseValue(Code);
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
        let id = $(mthis).data('code');
        let target = $(mthis).data('target');
        $('#' + target).modal('show');
        if (id == 0) {
            Common.BindValuesToStorageForm(new Storage(0, null));
        }
        else {
            Common.GetUnitTypeById(id);
        }
    }

    static ApplyAGGrid() {

        var gridDiv = document.querySelector('#unittypedata');
        new agGrid.Grid(gridDiv, unitTypeGridOptions);
        fetch(baseUrl + 'api/unittypes')
            .then((response) => response.json())
            .then(data => {                
                unitTypeGridOptions.api.setRowData(data);
                //Common.InitSelect2();
            })
            .catch(error => {
                unitTypeGridOptions.api.setRowData([])
                //toastr.error(error, '', {
                //    positionClass: 'toast-top-center'
                //});
            });

    }

    static BindValuesToStorageForm(model) {
        $('#UnitTypeErrorSection').empty();
        $('#Code').val(model.Code);
        $('#Name').val(model.Name);
    }

    static init() {
        $('#unittypedata').height(Common.calcDataTableHeight(27));
    }

    static async SaveUnitType(mthis) {
        $('#UnitTypeErrorSection').empty();
        let Code = $('#Code').val();
        let Name = $('#Name').val();
        let unitType = new UnitType(Code, Name);

        var response = await fetch(baseUrl + 'api/unittype/save', {
            method: 'POST',
            body: JSON.stringify(unitType),
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
                $('#UnitTypeErrorSection').html(errorHtml);
                return;
            }
        }
        if (response.success) {
            toastr.success("Unit Type Saved", '', { positionClass: 'toast-top-center' });
            let target = $(mthis).data('target');
            $('#' + target).modal('hide');
            if (Id == 0) {
                unitTypeGridOptions.api.applyTransaction({ add: [response.data] });//addIndex
            }
            else {
                unitTypeGridOptions.api.applyTransaction({ update: [response.data] });
            }
            let rowNode = unitTypeGridOptions.api.getRowNode(response.data.id);
            unitTypeGridOptions.api.flashCells({ rowNodes: [rowNode] });
            return;
        }
        if (response.success == false) {
            var errorHtml = "";
            $.each(response.errors, function (index, element) {
                errorHtml += element + '<br/>';
            });
            $('#UnitTypeErrorSection').html(errorHtml);
        }
    }
    }

jQuery(document).ready(function () {
    Common.init();
    Common.ApplyAGGrid();
});