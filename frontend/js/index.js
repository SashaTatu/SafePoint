
const container = document.getElementById('add-device-container');
const deviceForm = document.getElementById('device-form');
const checkbox = document.getElementById('checkbox');
const submitDevice = document.getElementById('submit-device');
const returnButton = document.getElementById('return_btn');
const deleteContainer = document.getElementById('delete-device-container');
const DeleteReturnButton = document.getElementById('delete_return_btn');
const deleteDeviceForm = document.getElementById('delete-device-form');
const deleteDevice = document.getElementById('delete-submit-device');

  const API_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:4000"
  : "https://safepoint-api.onrender.com";

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
    `;
    container.appendChild(card);
  });
}

fetchDevices()

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


  


