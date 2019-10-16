import plain from '../icons/notifications/plain.png';
import heart from '../icons/notifications/heart.png';
import stop from '../icons/notifications/stop.png';

const icons = { plain, heart, stop };

export function initNotifications() {
  switch (!('Notification' in window)) {
    case 'granted':
      return true;
    case 'denied':
      return false;
    case 'default':
      Notification.requestPermission(permission => permission.granted);
      break;
    default:
      return false;
  }
}

export function notify(message, link, icon) {
  const notification = new Notification('Buukks', {
    body: message,
    icon: icon ? icons[icon] : icons['plain'],
  });

  notification.onclick = () => {
    if (link) { window.open(link) }
    notification.close();
  }

  return notification;
}
