
const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change', () => {
  document.body.classList.toggle('dark', checkbox.checked);
});

const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const forgotPassword = document.getElementById('forgot-password');
  const forgotForm = document.getElementById('forgot-form');
  const closeForgot = document.getElementById('close-forgot');
  const forgotEmail = document.getElementById('forgot-email');
  const getOtp = document.getElementById('get-otp');
  const otpForm = document.getElementById('otp-input');
  const resetPassword = document.getElementById('reset-password');
  const resetPasswordForm = document.getElementById('reset-password-form');
  const newPassword = document.getElementById('newpassword');
  const confirmPassword = document.getElementById('confirm');

  const API_URL =  "https://safepoint-api.onrender.com";

  showRegister.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    document.getElementById('register-password').style.marginBottom = '15px';
  });

  showLogin.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

forgotPassword.addEventListener('click', () => {
  loginForm.style.display = 'none';

  forgotForm.style.display = 'block';
})

closeForgot.addEventListener('click', () => {
  forgotForm.style.display = 'none';
  otpForm.style.display = 'none';
  loginForm.style.display = 'block';

});


const inputs = document.querySelectorAll('.code-box');

inputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    if (input.value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && input.value === '' && index > 0) {
      inputs[index - 1].focus();
    }
  });
});



getOtp.addEventListener('click', async () => {
  const email = document.getElementById('forgot-email').value.trim();

  if (!email) {
    alert('❌ Введіть електронну пошту');
    return; // не продовжуємо
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/send-reset-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert('✅ Код для скидання пароля надіслано на вашу електронну пошту.');
      forgotEmail.style.display = 'none';
      getOtp.style.display = 'none';
      otpForm.style.display = 'flex';
      resetPassword.style.display = 'block';
      
    } else {
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
    console.error('❌ Помилка запиту:', err);
    alert('❌ Сервер недоступний або сталася помилка');
  }
});

resetPassword.addEventListener('click', async () => {
  function getOtpCode() {
  const boxes = document.querySelectorAll('#otp-input .code-box');
  let code = '';
  
  boxes.forEach(box => {
    code += box.value.trim();
  });

  return code;
  }

  const otp = getOtpCode();
  const email = document.getElementById('forgot-email').value.trim();

  try {
    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok && data.success) {
      forgotForm.style.display = 'none';
      resetPasswordForm.style.display = 'block';  
      
    } else {
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
    console.error('❌ Помилка запиту:', err);
    alert('❌ Сервер недоступний або сталася помилка');
  }
})

confirmPassword.addEventListener('click', async () => {
  const newPassword = document.getElementById('newpassword').value;
  const email = document.getElementById('again-email').value.trim();

  try {
    const res = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword, email }),
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok && data.success) {
      resetPasswordForm.style.display = 'none';
      loginForm.style.display = 'block';  
      
    } else {
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
    console.error('❌ Помилка запиту:', err);
    alert('❌ Сервер недоступний або сталася помилка');
  }
})



async function register() {
  const name = document.getElementById('register-fullname').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const region = document.getElementById('region').value;

  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, region }),
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert('✅ Реєстрація успішна! Ви можете увійти в систему.');
      window.location.href = '../index.html';
    } else {
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
    console.error('❌ Помилка запиту:', err);
    alert('❌ Сервер недоступний або сталася помилка');
  }
}



async function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert('✅Ви успішно ввійшли в систему.');
      window.location.href = '../index.html';
    } else {
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
    console.error('❌ Помилка запиту:', err);
    alert('❌ Сервер недоступний або сталася помилка');
  }
}


