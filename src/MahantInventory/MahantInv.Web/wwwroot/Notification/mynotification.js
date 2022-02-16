

class MyNotification {

    static async NotificationMessageTemplate() {
        let template = ' <div class="notifications-item"> <div class="notification-text"> <h4>{title}</h4> <p>{message}</p> </div> <div class="notification-action"> <button class="btn btn-light btn-sm" data-id="{id}">√</button> </div> </div> ';
        return template;
    }

    static async GetPendingORNotifiedNotifications() {
        fetch(baseUrl + 'api/notification/pendingornotified')
            .then((response) => response.json())
            .then(data => {
                if (data.pendingNotificationCount > 0) {
                    $('#NotificationPendingCount').show();
                    $('#NotificationPendingCount').html(data.pendingNotificationCount);
                } else {
                    $('#NotificationPendingCount').hide();
                }
                $('#NotificationMessages').empty();
                $('#NotificationMessages').html('<h2>Notifications</h2>');
                let template = MyNotification.NotificationMessageTemplate();
                let notificationIds = [];
                $.each(data.myNotifications, function (i, v) {
                    let message = template.supplant(v);
                    $('#NotificationMessages').appand(message);
                    if (v.status === 'Pending') {
                        notificationIds.push(v.id);
                    }
                });
                MyNotification.MarkAsNotified(notificationIds);
            })
            .catch(error => {
                console.log(error);
            });
    }
    static async MarkAsNotified(notificationIds) {
        fetch(baseUrl + 'api/notification/notified', {
            method: 'POST',
            body: JSON.stringify(notificationIds),
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
            .then((response) => response.json())
            .then(data => {

            })
            .catch(error => {
                console.log(error);
            });
    }
    static async MarkAsRead(mthis) {
        fetch(baseUrl + 'api/notification/read', {
            method: 'POST',
            body: JSON.stringify(notificationIds),
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
            .then((response) => response.json())
            .then(data => {
                //MArk as read
            })
            .catch(error => {
                console.log(error);
            });
    }

    static init() {

    }


}

jQuery(document).ready(function () {
    MyNotification.init();
});