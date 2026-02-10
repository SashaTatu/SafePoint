
const container = document.getElementById('add-device-container');
const deviceForm = document.getElementById('device-form');
const checkbox = document.getElementById('checkbox');
const submitDevice = document.getElementById('submit-device');
const returnButton = document.getElementById('return_btn');
const deleteContainer = document.getElementById('delete-device-container');
const DeleteReturnButton = document.getElementById('delete_return_btn');
const deleteDeviceForm = document.getElementById('delete-device-form');
const deleteDevice = document.getElementById('delete-submit-device');
const avatar = document.getElementById('user-avatar');
const menu = document.getElementById('user-menu');
const logoutBtn = document.getElementById('logout-btn');
const nextButton = document.getElementById('nextButton');
const saveProfileButton = document.getElementById('save-profile');
window.API_URL = "https://safepoint-bei0.onrender.com";

let devices = [];


async function UserNameGet() {
  try {
    const res = await fetch(`${API_URL}/api/user/data`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok && data.success) {
      generateAvatar(data.userData.name);
    } else {
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
    console.error('❌ Помилка запиту:', err);
    alert('❌ Сервер недоступний або сталася помилка');
  }
}

function generateAvatar(userName) {
  const avatar = document.getElementById("user-avatar");

  const colors = [
    "#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#845EC2",
    "#00C9A7", "#FF9671", "#FFC75F", "#F9F871", "#0081CF"
  ];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  const initial = userName ? userName.trim()[0].toUpperCase() : "?";

  avatar.style.backgroundColor = bgColor;
  avatar.textContent = initial;
}


UserNameGet();




async function fetchDevices() {
  try {
    const res = await fetch(`${API_URL}/api/devices/data`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok && data.success) {

      devices.length = 0; 
      devices.push(...data.data); 

      renderDeviceCards(devices); 
    } else {
    }
  } catch (err) {
      console.error('❌ Помилка запиту:', err);
  }
}


function renderDeviceCards(devices) {
  const container = document.getElementById("device-container");
  container.innerHTML = "";

  devices.forEach(device => {
    const isLocked = Boolean(device.status);
    let statusText = "";
    let statusClass = "";
    if (isLocked === true) {
          statusText = "Відчинено";
          statusClass = "open";
    } else {
          statusText = "Зачинено";
          statusClass = "closed";
    }


    const card = document.createElement("div");
    card.className = "shelter-card card-enter";

    card.innerHTML = `
      <div class="shelter-header">
        <div class="shelter-header-left">
          <h3>Укриття</h3>
          <p>${device.deviceId}</p>
        </div>
          <i class="fas fa-bars delete-btn" data-deviceid="${device.deviceId}" data-toggle="tooltip" title="Видалити пристрій"></i>
      </div>

      <div class="shelter-body">
        <p><strong>Адреса:</strong> ${device.address}</p>
        <p><strong>Статус:</strong> <span class="${statusClass}">${statusText}</span></p>
      </div>

      <a href="/device/${device.deviceId}" class="shelter-footer-link">
        Перейти до пристрою
      </a>
    `;

    container.appendChild(card);
  });
}

fetchDevices();

setInterval(() => fetchDevices(), 65000);




async function fetchUser() {
  try {
    const res = await fetch(`${API_URL}/api/auth/getuser`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok && data.success) {

      document.getElementById("name").value = data.data.name;
      document.getElementById("region").value = data.data.region;
    } else {
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
    console.error('❌ Помилка запиту:', err);
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  const overlay = document.getElementById('pushOverlay');
  const allowBtn = document.getElementById('allow');
  const denyBtn = document.getElementById('deny');

  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('/sw.js');
  }

  let alreadySubscribed = false;

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      alreadySubscribed = true;
    }
  }

  if (
    'Notification' in window &&
    Notification.permission === 'default' &&
    !alreadySubscribed
  ) {
    overlay.hidden = false;
  } else {
    overlay.hidden = true;
  }

  allowBtn.addEventListener('click', async () => {
    overlay.hidden = true;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        if (typeof window.subscribeUser === 'function') {
          await window.subscribeUser();
        } else {
          console.warn('subscribeUser not defined on window');
        }
      }
    } catch (e) {
      console.error('Subscribe error:', e);
    }
  });

  denyBtn.addEventListener('click', () => {
    overlay.hidden = true;
  });
});





avatar.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!avatar.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
  }
});

document.getElementById("edit-profile-btn").addEventListener("click", () => {
  fetchUser();
  document.getElementById("editModal").style.display = "flex";
});


window.addEventListener("click", (e) => {
  const modal = document.getElementById("editModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

saveProfileButton.addEventListener('click', async () => {
  const name = document.getElementById("name").value.trim();
  const region = document.getElementById("region").value;
  try {
    const res = await fetch(`${API_URL}/api/user/change-info`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, region }),
      credentials: 'include'
    });
    const data = await res.json();

    if (res.ok && data.success) {
      alert('✅ Інформацію оновлено успішно');
      document.getElementById("editModal").style.display = "none";
      generateAvatar(name);
    } else {
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
    console.error('❌ Помилка запиту:', err);
    alert('❌ Сервер недоступний або сталася помилка');
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('✅ Ви успішно вийшли з системи');
      window.location.href = '../enter.html';
    } else {
      alert('❌ Помилка: ' + (data.message || 'Невідома помилка'));
    }
  } catch (error) {
    console.error('❌ Помилка запиту:', error);
    alert('❌ Сервер недоступний або сталася помилка');
  }
});


document.addEventListener('DOMContentLoaded', () => {
    const notifBtn = document.getElementById('notification-btn');
    const notifDropdown = document.getElementById('notification-dropdown');
    const notifList = document.getElementById('notification-list');
    const notifBadge = document.getElementById('notification-badge');

    // Перемикання списку
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('hidden');
        if (!notifDropdown.classList.contains('hidden')) {
            fetchNotifications();
        }
    });

    // Закриття при кліку поза меню
    document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
            notifDropdown.classList.add('hidden');
        }
    });

    async function fetchNotifications() {
        try {
            const res = await fetch('/api/notifications');
            const result = await res.json();
            if (result.success) renderNotifications(result.data);
        } catch (err) {
            console.error("Помилка завантаження сповіщень", err);
        }
    }

    function renderNotifications(data) {
        if (!data || data.length === 0) {
            notifList.innerHTML = '<li class="empty-msg" style="padding:20px; text-align:center; color:#666;">Немає нових сповіщень</li>';
            notifBadge.classList.add('hidden');
            return;
        }

        const unread = data.filter(n => !n.isRead).length;
        if (unread > 0) {
            notifBadge.textContent = unread;
            notifBadge.classList.remove('hidden');
        } else {
            notifBadge.classList.add('hidden');
        }

        notifList.innerHTML = data.map(n => `
            <li class="notif-item ${n.isRead ? '' : 'unread'}">
                <div class="notif-icon">${getIcon(n.type)}</div>
                <div class="notif-text">
                    <div class="notif-title">${n.title}</div>
                    <div class="notif-body">${n.body}</div>
                    <div class="notif-time">${new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            </li>
        `).join('');
    }

    function getIcon(type) {
        const icons = { alert: '🔴', temp: '🌡️', co2: '🌬️', humi: '💧' };
        return icons[type] || '🔔';
    }

    // Періодична перевірка лічильника (наприклад, кожні 2 хв)
    setInterval(fetchNotifications, 120000);
    fetchNotifications();
});



checkbox.addEventListener('change', () => {
  document.body.classList.toggle('dark', checkbox.checked);
});


function AddDeviceConteiner() {
  container.style.display = 'flex';
}



returnButton.addEventListener('click', () => {
  container.style.display = 'none';

});



deviceForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // блокує перезавантаження

  const deviceId = document.getElementById('device-id').value.trim();
  const address = document.getElementById('device-address').value.trim();

  if (!deviceId || !address) {
    alert('❌ Будь ласка, заповніть всі поля');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/devices/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ deviceId, address })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('✅ Пристрій успішно додано');
      container.style.display = 'none';
      fetchDevices()
    } else {
      alert('❌ Помилка: ' + (data.message || 'Невідома помилка'));
    }
  } catch (error) {
    console.error('❌ Помилка запиту:', error);
    alert('❌ Сервер недоступний або сталася помилка');
  }
});


document.addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    const deviceId = e.target.dataset.deviceid;
    const deleteInput = document.getElementById('delete-device-id');
    if (deleteInput) deleteInput.value = deviceId || '';
    deleteContainer.style.display = 'flex';
  }
});


deleteDeviceForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // блокує перезавантаження

  const deviceId = document.getElementById('delete-device-id').value.trim();

  if (!deviceId ) {
    alert('❌ Будь ласка, заповніть всі поля');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/devices/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ deviceId })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('✅ Пристрій успішно видалено');
      deleteContainer.style.display = 'none';
      fetchDevices()
    } else {
      alert('❌ Помилка: ' + (data.message || 'Невідома помилка'));
    }
  } catch (error) {
    console.error('❌ Помилка запиту:', error);
    alert('❌ Сервер недоступний або сталася помилка');
  }
});

DeleteReturnButton.addEventListener('click', () => {
  deleteContainer.style.display = 'none';

});





  


