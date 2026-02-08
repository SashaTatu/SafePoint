const API_URL = "https://safepoint-bei0.onrender.com/api/subscribe/";

const publicKey = 'BErJ7Fht80zeUpxYZu54CoOTol6ujZoPlEPwmY_yv5bEo6Ut5O1th6R3q1rMkO6PLaF2yOrNqSYvKucvzpyW-Po';

async function subscribeUser() {
  const reg = await navigator.serviceWorker.ready;

  let subscription = await reg.pushManager.getSubscription();

  if (!subscription) {
    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });
  }

  // 🔥 Ось тут зберігаємо на сервері
  await fetch(`${API_URL}/api/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // якщо є авторизація:
      // 'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify(subscription)
  });
}

window.subscribeUser = subscribeUser;
