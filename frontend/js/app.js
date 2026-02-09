
const publicKey = 'BErJ7Fht80zeUpxYZu54CoOTol6ujZoPlEPwmY_yv5bEo6Ut5O1th6R3q1rMkO6PLaF2yOrNqSYvKucvzpyW-Po';

// 1. ОБОВ'ЯЗКОВА ФУНКЦІЯ (якої не вистачало)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeUser() {
  try {
    const API_URL = window.API_URL || 'https://safepoint-bei0.onrender.com';

    if (!('serviceWorker' in navigator)) return;

    const reg = await navigator.serviceWorker.ready;
    let subscription = await reg.pushManager.getSubscription();

    // 2. Використовуємо функцію конвертації для ключа
    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
    }

    const payload = subscription.toJSON();

    // 3. Відправка на сервер
    const response = await fetch(`${API_URL}/api/subscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token') 
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('Підписка успішно збережена в БД');
    } else {
      console.error('Сервер повернув помилку:', response.status);
    }
  } catch (err) {
    console.error('Помилка в subscribeUser:', err);
  }
}

window.subscribeUser = subscribeUser;

