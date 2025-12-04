import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password, region } = req.body;

  // 1. Перевірка полів
  if (!name || !email || !password || !region) {
    return res.status(400).json({ success: false, message: "Заповніть всі поля" });
  }

  try {
    // 2. Перевіряємо чи email існує
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email вже зареєстрований" });
    }

    // 3. Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Створюємо користувача
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      region
    });

    await user.save();

    // 5. Створюємо JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log("📨 Надсилаємо листа на:", email);

    // 7. Лист
    await transporter.sendMail({
      from: `"SafePoint" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Вітаємо у SafePoint!",
      text: `Привіт ${name},\n\nВаш акаунт успішно створено. Ви можете увійти, використовуючи ваш email та пароль.\n\nДякуємо за реєстрацію!\n\nЗ повагою,\nКоманда SafePoint`
    });

    console.log("✅ Лист успішно відправлено!");

    // 8. Відповідь клієнту
    return res.status(201).json({
      success: true,
      message: "Користувача зареєстровано успішно, лист надіслано",
      token
    });

  } catch (error) {
    console.error("❌ Помилка реєстрації:", error);
    return res.status(500).json({
      success: false,
      message: "Помилка на сервері",
      error: error.message
    });
  }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Заповніть будь ласка всі поля' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Користувача з таким email не знайдено' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Невірний пароль' });
        }

        const token  = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 днів
        });

        return res.status(200).json({
            success: true,
            message: 'Успішний вхід',
            userId: user._id,
            token
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Помилка входу', error });
    }
}

export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
         sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict'
        });
   
        res.status(200).json({ success: true, message: 'Вихід успішний' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Помилка виходу', error });
        }
}

export const sendVerifyOtp = async (req, res) => {
    
    try {
        
        const{ userId } = req.body;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified) {
            return res.status(400).json({ success: false, message: 'Акаунт вже підтверджено' });
        }

        const otp = String(Math.floor(100000 + Math.random()*900000))

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 1 день

        await user.save();

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: user.email,
            subject: 'Підтвердження акаунту SafePoint',
            text: `Ваш код для підтвердження акаунту: ${otp}\n\nЦей код дійсний протягом 24 годин.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Код підтвердження надіслано на вашу електронну пошту' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Помилка надсилання коду для підтверження', error });
    }
}

export const verifyEmail = async (req, res) => {
    
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: 'Заповніть будь ласка всі поля' });
    }

    try{
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
        }

        if(user.verifyOtp == '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Невірний код підтвердження' });

        }

        if(user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'Код підтвердження вичерпано' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        res.status(200).json({ success: true, message: 'Акаунт успішно підтверджено' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Помилка підтвердження електронної пошти', error });
    }
}

export const isAuthenticated = (req, res) => {

    try {
        return res.status(200).json({ success: true, message: 'Користувач автентифікований' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Помилка перевірки автентифікації', error });
    }
}

export const sendResetOtp = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Заповніть будь ласка всі поля' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 хвилин

        await user.save();

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Скидання паролю SafePoint',
            text: `Ваш код для скидання паролю: ${otp}\n\nЦей код дійсний протягом 15 хвилин.`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'Код для скидання паролю надіслано на вашу електронну пошту' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Помилка надсилання коду для скидання паролю', error });
    }
}

export const verifyOtp = async (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Заповніть будь ласка всі поля' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
        }

        if (user.resetOtp ==="" || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Невірний код скидання паролю' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'Код скидання паролю вичерпано' });
        }

        await user.save();

        return res.status(200).json({ success: true, message: 'Код підтверженно' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Помилка підтверження кода', error });
    }

}

export const resetPassword = async (req, res) => {

    const { newPassword, email} = req.body;

    if (!newPassword || !email) {
        return res.status(400).json({ success: false, message: 'Заповніть всі поля' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
        }
       
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: 'Пароль успішно змінено' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Помилка скидання паролю', error });
    }

}

export const getUser = async (req, res) => {

    const userId = req.userId

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
    }

    return res.status(200).json({
      success: true,
      data: {
        name: user.name,
        region: user.region
      }})
  } catch (error) {
    res.status(500).json({ success: false, message: 'Помилка отримання даних користувача', error });
  }
};


