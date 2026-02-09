
const publicKey = 'BErJ7Fht80zeUpxYZu54CoOTol6ujZoPlEPwmY_yv5bEo6Ut5O1th6R3q1rMkO6PLaF2yOrNqSYvKucvzpyW-Po';

async function subscribeUser() {
  try {
    const API_URL = window.API_URL || 'https://safepoint-bei0.onrender.com';

    if (!('serviceWorker' in navigator)) {
      console.warn('Service worker not supported');
      return;
    }

    if (typeof urlBase64ToUint8Array !== 'function') {
      console.warn('urlBase64ToUint8Array is not defined');
    }

    const reg = await navigator.serviceWorker.ready;

    let subscription = await reg.pushManager.getSubscription();

    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: typeof urlBase64ToUint8Array === 'function'
          ? urlBase64ToUint8Array(publicKey)
          : null
      });
    }

    // send subscription to server (convert to JSON)
    const payload = subscription && typeof subscription.toJSON === 'function'
      ? subscription.toJSON()
      : subscription;

    await fetch(`${API_URL}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('subscribeUser error:', err);
  }
}

window.subscribeUser = subscribeUser;
