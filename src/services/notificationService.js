import { toast } from 'react-toastify';

// Request notification permission (browser-safe)
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.error('This browser does not support notifications');
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Show notification immediately (react-toastify does not support scheduling)
const showNotification = (lead) => {
  toast.info(`Follow-up reminder for ${lead.name} regarding ${lead.enquiry}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const showCarNotification = (car) => {
  toast.info(`Follow-up reminder for ${car.name} regarding ${car.enquiry}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export { requestNotificationPermission, showNotification };