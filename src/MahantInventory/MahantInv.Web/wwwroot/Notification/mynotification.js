
let down = false;
let notificationIds = [];
let pendingNotificationCount = 0;
class MyNotification {

    static async NotificationMessageTemplate() {
        let template = ' <div class="notifications-item"> <div class="notification-text"> <h4>{title}</h4> <p>{message}</p> </div> <div class="notification-action"> <button class="btn btn-light btn-sm" onclick="MyNotification.MarkAsRead(this)" data-id="{id}">√</button> </div> </div> ';
        return template;
    }

    static async GetPendingORNotifiedNotifications() {
        fetch(baseUrl + 'api/notification/pendingornotified')
            .then((response) => response.json())
            .then(data => {
                if (data.pendingNotificationCount > 0) {
                    $('#NotificationPendingCount').show();
                    $('#NotificationPendingCount').html(data.pendingNotificationCount);
                    pendingNotificationCount = data.pendingNotificationCount;
                } else {
                    $('#NotificationPendingCount').hide();
                }
                pendingNotificationCount = 0;
                $('#NotificationMessages').empty();
                $('#NotificationMessages').html('<h2>Notifications</h2>');
                let template = MyNotification.NotificationMessageTemplate();
                
                $.each(data.myNotifications, function (i, v) {
                    let message = template.supplant(v);
                    $('#NotificationMessages').appand(message);
                    if (v.status === 'Pending') {
                        notificationIds.push(v.id);
                    }
                });
                //MyNotification.MarkAsNotified(notificationIds);
            })
            .catch(error => {
                console.log(error);
            });
    }
    static async MarkAsNotified() {
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

    static async ViewNotificationModal(mthis) {
        if (down) {

            $('#NotificationMessages').css('height', '0px');
            $('#NotificationMessages').css('opacity', '0');
            down = false;
        } else {
            $('#NotificationMessages').css('height', 'auto');
            $('#NotificationMessages').css('opacity', '1');
            down = true;
        }
        if (pendingNotificationCount > 0) {
            MyNotification.MarkAsNotified();
        }

    }

    static init() {
        MyNotification.GetPendingORNotifiedNotifications();
    }


}

jQuery(document).ready(function () {
    MyNotification.init();
});