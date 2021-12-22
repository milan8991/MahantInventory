function ActionCellRenderer() { }

ActionCellRenderer.prototype.init = function (params) {
    this.params = params;

    this.eGui = document.createElement('span');
    this.eGui.innerHTML = '<button class="btn btn-sm btn-link" type="button" onclick="Common.OpenModal(this)" data-id="' + params.data.id + '" data-target="AddEditProduct">Edit</button>';
}

ActionCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

var payerGridOptions = {

    // define grid columns
    columnDefs: [
        {
            headerName: 'Name', field: 'name', filter: 'agTextColumnFilter', headerTooltip: 'Name'
        },
        {
            headerName: 'Primary Contact', field: 'primaryContact', filter: 'agTextColumnFilter', headerTooltip: 'Primary Contact'
        },
        {
            headerName: 'Secondary Contact', field: 'secondaryContact', filter: 'agTextColumnFilter', headerTooltip: 'Secondary Contact'
        },
        {
            headerName: 'Address', field: 'address', filter: 'agTextColumnFilter', headerTooltip: 'Address'
        },        
        {
            headerName: 'Taluk', field: 'taluk', filter: 'agTextColumnFilter', headerTooltip: 'Taluk'
        },
        {
            headerName: 'District', field: 'district', filter: 'agTextColumnFilter', headerTooltip: 'District'
        },
        {
            headerName: 'State', field: 'state', filter: 'agTextColumnFilter', headerTooltip: 'State'
        },
        {
            headerName: 'Country', field: 'country', filter: 'agTextColumnFilter', headerTooltip: 'Country'
        },
        {
            headerName: '', field: 'id', headerTooltip: 'Action',
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

    },
    overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center">Please wait while your payers are loading</span>',
    overlayNoRowsTemplate:
        `<div class="text-center">
                <h5 class="text-center"><b>Payers will be appear here.</b></h5>
            </div>`
};


class Payer {
    constructor(Id, Name, PrimaryContact, SecondaryContact, Line1, Line2, Taluk, District, State, Country) {
        this.Id = parseInt(Id);
        this.Name = Common.ParseValue(Name);
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
            Common.BindValuesToProductForm(new Payer(0, null, null, null, null, null, null, null, null, null, null));
        }
        else {
            Common.GetPayerById(id);
        }
    }

    static ApplyAGGrid() {

        var gridDiv = document.querySelector('#payersdata');
        new agGrid.Grid(gridDiv, payerGridOptions);
        fetch(baseUrl + 'api/payers')
            .then((response) => response.json())
            .then(data => {
                payerGridOptions.api.setRowData(data);
                //Common.InitSelect2();
            })
            .catch(error => {
                payerGridOptions.api.setRowData([])
                //toastr.error(error, '', {
                //    positionClass: 'toast-top-center'
                //});
            });

    }

    static BindValuesToProductForm(model) {
        $('#PayerErrorSection').empty();
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
        $('#payersdata').height(Common.calcDataTableHeight(27));
    }

    static async SavePayer(mthis) {
        $('#PayerErrorSection').empty();
        let Id = $('#Id').val();
        let Name = $('#Name').val();
        let PrimaryContact = $('#PrimaryContact').val();
        let SecondaryContact = $('#SecondaryContact').val();
        let Line1 = $('#Line1').val();
        let Line2 = $('#Line2').val();
        let Taluk = $('#Taluk').val();
        let District = $('#District').val();
        let State = $('#State').val();
        let Country = $('#Country').val();
        let product = new Product(Id, Name, PrimaryContact, SecondaryContact, Line1, Line2, Taluk, District, State, Country);

        var response = await fetch(baseUrl + 'api/payer/save', {
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
                $('#PayerErrorSection').html(errorHtml);
            }
        }
        if (response.success) {
            toastr.success("Payer Saved", '', { positionClass: 'toast-top-center' });
            let target = $(mthis).data('target');
            $('#' + target).modal('hide');
            if (Id == 0) {
                payerGridOptions.api.applyTransaction({ add: [response.data] });//addIndex
            }
            else {
                payerGridOptions.api.applyTransaction({ update: [response.data] });
            }
            let rowNode = payerGridOptions.api.getRowNode(response.data.id);
            payerGridOptions.api.flashCells({ rowNodes: [rowNode] });
            $("#ProductUsageSelect").select2('destroy').empty();
            setTimeout(function () {
                Common.InitSelect2();
            }, 1000);
        }
    }
    static async GetPayerById(id) {
        await fetch(baseUrl + 'api/payer/byid/' + id, {
            method: 'GET',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => { return response.json() })
            .then(data => {
                Common.BindValuesToProductForm(new Payer(data.id, data.name, data.primaryContact, data.secondaryContact, data.line1, data.line2, data.taluk, data.district, data.state, data.country));
            })
            .catch(error => {
                console.log(error);
                toastr.success("Unexpected error", '', { positionClass: 'toast-top-center' });
            });
    }

    static BindSelectData() {
        var result = [];
        payerGridOptions.api.forEachNode((rowNode, index) => {
            result.push({ id: rowNode.data.id, text: rowNode.data.name });
        });
        return result;
    }
    static async InitSelect2() {
        $('#ProductUsageSelect').select2({
            placeholder: 'Search Product',
            minimumInputLength: 1,
            maximumSelectionLength: 1,
            minimumResultsForSearch: 10,
            theme: "classic",
            data: Common.BindSelectData(),
            closeOnSelect: true,
            allowClear: true
        });
    }

    
}

jQuery(document).ready(function () {
    Common.init();
    Common.ApplyAGGrid();
});