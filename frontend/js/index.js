
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

  const API_URL =  "https://safepoint-bei0.onrender.com";

let devices =[]


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
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
      console.error('❌ Помилка запиту:', err);
  }
}


function renderDeviceCards(devices) {
  const container = document.getElementById("device-container");
  container.innerHTML = "";

  devices.forEach(device => {
    const card = document.createElement("div");
    card.className = "shelter-card card-enter";
    card.innerHTML = `
      <div class="shelter-header">
        <div class="shelter-header-left">
          <h3>Укриття</h3>
          <p>${device.deviceId}</p>
        </div>
        <i class="fas fa-bars" id="delete_btn" data-toggle="tooltip" title="Видалити пристрій"></i>
      </div>
      <div class="shelter-body">
        <p><strong>Адреса:</strong> ${device.address}</p>
        <p><strong>Статус:</strong> <span class="status-${device.status}">${device.status}</span></p>
      </div>
      <a href="/device/${device.deviceId}" class="shelter-footer-link">Перейти до пристрою</a>
    `;
    container.appendChild(card);
  });
}

fetchDevices()


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

// Закрити модальне вікно при кліку поза ним
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
  if (e.target.matches('#delete_btn')) {
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





  


