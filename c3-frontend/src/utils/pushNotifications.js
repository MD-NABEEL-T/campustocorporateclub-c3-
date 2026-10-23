// Utility functions to manage Web Push Notifications on phones and desktops

export const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const isPushSupported = () => {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
};

export const getNotificationPermission = () => {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission; // 'granted' | 'denied' | 'default'
};

export const subscribeToPush = async (api) => {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported on this device/browser');
  }

  // 1. Request user permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error(
      permission === 'denied'
        ? 'Notification permission was denied. Please enable notifications in your browser site settings.'
        : 'Notification permission was dismissed'
    );
  }

  // 2. Fetch VAPID public key from backend
  let vapidKeyData;
  try {
    const res = await api.get('/notifications/vapid-key');
    vapidKeyData = res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Server VAPID notification keys not configured yet');
  }

  if (!vapidKeyData?.publicKey) {
    throw new Error('VAPID public key not found on server');
  }

  // 3. Register service worker
  const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  await navigator.serviceWorker.ready;

  // 4. Create or retrieve existing push subscription
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    const convertedKey = urlBase64ToUint8Array(vapidKeyData.publicKey);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey,
    });
  }

  // 5. Send subscription to backend
  try {
    const subJSON = subscription.toJSON();
    await api.post('/notifications/subscribe', {
      endpoint: subJSON.endpoint,
      keys: subJSON.keys,
    });
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to save device subscription on server');
  }

  localStorage.setItem('c3_notifications_enabled', 'true');
  return subscription;
};

export const unsubscribeFromPush = async (api) => {
  if (!isPushSupported()) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      await api.post('/notifications/unsubscribe', { endpoint }).catch(() => {});
    }
  } catch (err) {
    console.error('Error unsubscribing:', err);
  } finally {
    localStorage.removeItem('c3_notifications_enabled');
  }
};
