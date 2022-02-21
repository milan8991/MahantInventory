
let down = false;
let notificationIds = [];
let pendingNotificationCount = 0;
class MyNotification {

    static NotificationMessageTemplate() {
        return ' <div class="notifications-item"> <div class="notification-text"> <h4>{title}</h4> <p>{message}</p> </div> <div class="notification-action"> <button class="btn btn-light btn-sm" onclick="MyNotification.MarkAsRead(this)" data-id="{id}">√</button> </div> </div> ';
    }

    static async GetPendingORNotifiedNotifications() {

        fetch(baseUrl + 'api/notification/pendingornotified')
            .then((response) => response.json())
            .then(data => {
                $('#NotificationMessages').empty();
                if (data.pendingNotificationCount > 0) {
                    $('#NotificationPendingCount').show();
                    $('#NotificationPendingCount').html(data.pendingNotificationCount);
                    pendingNotificationCount = data.pendingNotificationCount;

                } else {
                    $('#NotificationPendingCount').hide();
                    pendingNotificationCount = 0;

                }
                if (data.myNotifications.length == 0) {
                    $('#NotificationMessages').html('<h2>Notifications</h2><h6>Notifications will be appear here</h6>');
                }
                else {
                    $('#NotificationMessages').html('<h2>Notifications</h2>');
                    let template = MyNotification.NotificationMessageTemplate();
                    $.each(data.myNotifications, function (i, v) {
                        let message = template.supplant(v);
                        $('#NotificationMessages').append(message);
                        if (v.status === 'Pending') {
                            notificationIds.push(v.id);
                        }
                    });
                }

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
            },
        })
            .then((response) => response.json())
            .then(data => {

            })
            .catch(error => {
                console.log(error);
            });

    }
    static async MarkAsRead(mthis) {
        let id = $(mthis).data('id');
        fetch(baseUrl + 'api/notification/read', {
            method: 'POST',
            body: JSON.stringify({ id: id }),
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())
            .then(data => {
                $(mthis).closets('.notifications-item').remove();
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