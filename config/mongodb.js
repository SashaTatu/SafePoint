import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
    });

    console.log('✅ База даних підключена');
  } catch (err) {
    console.error('❌ Помилка підключення до бази:', err);
  }
};

export default connectDB;
