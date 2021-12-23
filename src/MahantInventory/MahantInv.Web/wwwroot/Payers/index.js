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
            headerName: 'Payer Type', field: 'payerType', filter: 'agSetColumnFilter', headerTooltip: 'Payer Type'
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
            headerName: 'Country', field: 'country', filter: 'agSetColumnFilter', headerTooltip: 'Country'
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
    constructor(Id, Name, PayerType, PrimaryContact, SecondaryContact, Line1, Line2, Taluk, District, State, Country) {
        this.Id = parseInt(Id);
        this.Name = Common.ParseValue(Name);
        this.PayerType = Common.ParseValue(PayerType);
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
            Common.BindValuesToPayerForm(new Payer(0, null,null, null, null, null, null, null, null, null, null, null));
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
                Common.InitSelect2();
            })
            .catch(error => {
                payerGridOptions.api.setRowData([])
                //toastr.error(error, '', {
                //    positionClass: 'toast-top-center'
                //});
            });

    }

    static BindValuesToPayerForm(model) {
        $('#PayerErrorSection').empty();
        $('#Id').val(model.Id);
        $('#Name').val(model.Name);
        $('#PayerType').val(model.PayerType);
        $('#PrimaryContact').val(model.PrimaryContact);
        $('#SecondaryContact').val(model.SecondaryContact);
        $('#Line1').val(model.Line1);
        $('#Line2').val(model.Line2);
        $('#Taluk').val(model.Taluk);
        $('#District').val(model.District);
        $('#State').val(model.State);
        $('#Country').val(model.Country);
    }

    static init() {
        $('#payersdata').height(Common.calcDataTableHeight(27));
    }

    static async SavePayer(mthis) {
        $('#PayerErrorSection').empty();
        let Id = $('#Id').val();
        let Name = $('#Name').val();
        let PayerType = $('#PayerType').val();
        let PrimaryContact = $('#PrimaryContact').val();
        let SecondaryContact = $('#SecondaryContact').val();
        let Line1 = $('#Line1').val();
        let Line2 = $('#Line2').val();
        let Taluk = $('#Taluk').val();
        let District = $('#District').val();
        let State = $('#State').val();
        let Country = $('#Country').val();
        let payer = new Payer(Id, Name, PayerType, PrimaryContact, SecondaryContact, Line1, Line2, Taluk, District, State, Country);

        var response = await fetch(baseUrl + 'api/payer/save', {
            method: 'POST',
            body: JSON.stringify(payer),
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
                return;
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
            return;
        }
        if (response.success == false) {
            var errorHtml = "";
            $.each(response.errors, function (index, element) {
                errorHtml += element + '<br/>';
            });
            $('#PayerErrorSection').html(errorHtml);
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
                $('#AddEditPayer').modal('show');
                Common.BindValuesToPayerForm(new Payer(data.id, data.name, data.payerType, data.primaryContact, data.secondaryContact, data.line1, data.line2, data.taluk, data.district, data.state, data.country));
            })
            .catch(error => {
                console.log(error);
                toastr.success("Unexpected error", '', { positionClass: 'toast-top-center' });
            });
    }

    static BindSelectData() {
        var result = ',Afghanistan,Aland Islands,Albania,Algeria,American Samoa,Andorra,Angola,Anguilla,Antarctica,Antigua and Barbuda,Argentina,Armenia,Aruba,Australia,Austria,Azerbaijan,Bahamas,Bahrain,Bangladesh,Barbados,Belarus,Belgium,Belize,Benin,Bermuda,Bhutan,Bolivia,Bosnia and Herzegovina,Botswana,Bouvet Island,Brazil,British Indian Ocean Territory,British Virgin Islands,Brunei,Bulgaria,Burkina Faso,Burundi,Cambodia,Cameroon,Canada,Cape Verde,Caribbean Netherlands,Cayman Islands,Central African Republic,Chad,Chile,China,Christmas Island,Cocos (Keeling) Islands,Colombia,Comoros,Cook Islands,Costa Rica,Croatia,Cuba,Curaçao,Cyprus,Czechia,Denmark,Djibouti,Dominica,Dominican Republic,DR Congo,Ecuador,Egypt,El Salvador,Equatorial Guinea,Eritrea,Estonia,Eswatini,Ethiopia,Falkland Islands,Faroe Islands,Fiji,Finland,France,French Guiana,French Polynesia,French Southern and Antarctic Lands,Gabon,Gambia,Georgia,Germany,Ghana,Gibraltar,Greece,Greenland,Grenada,Guadeloupe,Guam,Guatemala,Guernsey,Guinea,Guinea-Bissau,Guyana,Haiti,Heard Island and McDonald Islands,Honduras,Hong Kong,Hungary,Iceland,India,Indonesia,Iran,Iraq,Ireland,Isle of Man,Israel,Italy,Ivory Coast,Jamaica,Japan,Jersey,Jordan,Kazakhstan,Kenya,Kiribati,Kosovo,Kuwait,Kyrgyzstan,Laos,Latvia,Lebanon,Lesotho,Liberia,Libya,Liechtenstein,Lithuania,Luxembourg,Macau,Madagascar,Malawi,Malaysia,Maldives,Mali,Malta,Marshall Islands,Martinique,Mauritania,Mauritius,Mayotte,Mexico,Micronesia,Moldova,Monaco,Mongolia,Montenegro,Montserrat,Morocco,Mozambique,Myanmar,Namibia,Nauru,Nepal,Netherlands,New Caledonia,New Zealand,Nicaragua,Niger,Nigeria,Niue,Norfolk Island,North Korea,North Macedonia,Northern Mariana Islands,Norway,Oman,Pakistan,Palau,Palestine,Panama,Papua New Guinea,Paraguay,Peru,Philippines,Pitcairn Islands,Poland,Portugal,Puerto Rico,Qatar,Republic of the Congo,Réunion,Romania,Russia,Rwanda,Saint Barthélemy,Saint Helena, Ascension and Tristan da Cunha,Saint Kitts and Nevis,Saint Lucia,Saint Martin,Saint Pierre and Miquelon,Saint Vincent and the Grenadines,Samoa,San Marino,São Tomé and Príncipe,Saudi Arabia,Senegal,Serbia,Seychelles,Sierra Leone,Singapore,Sint Maarten,Slovakia,Slovenia,Solomon Islands,Somalia,South Africa,South Georgia,South Korea,South Sudan,Spain,Sri Lanka,Sudan,Suriname,Svalbard and Jan Mayen,Sweden,Switzerland,Syria,Taiwan,Tajikistan,Tanzania,Thailand,Timor-Leste,Togo,Tokelau,Tonga,Trinidad and Tobago,Tunisia,Turkey,Turkmenistan,Turks and Caicos Islands,Tuvalu,Uganda,Ukraine,United Arab Emirates,United Kingdom,United States,United States Minor Outlying Islands,United States Virgin Islands,Uruguay,Uzbekistan,Vanuatu,Vatican City,Venezuela,Vietnam,Wallis and Futuna,Western Sahara,Yemen,Zambia,Zimbabwe';
        return result.split(',');
    }
    static async InitSelect2() {
        $('#Country').select2({
            placeholder: 'Search Counry',
            data: Common.BindSelectData(),
            theme: "bootstrap4",
            dropdownParent: $("#AddEditPayer")
        });
    }


}

jQuery(document).ready(function () {
    Common.init();
    Common.ApplyAGGrid();
});