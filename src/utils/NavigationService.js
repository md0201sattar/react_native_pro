import NavigationService from './NavigationService';
import PushNotification from "react-native-push-notification";

PushNotification.configure({
    onNotification: function (notification) {
        const { data } = notification;
       
    }
});
