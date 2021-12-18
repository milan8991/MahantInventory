

class CommonForOrder {
   
    static async SaveOrder(mthis) {
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
    
}

jQuery(document).ready(function () {
    
});