import mongoose from "mongoose";
// jsonwebtoken not used here — removed unused import

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    region: {type: String, required: true},
    uid: { type: Number, required: true },
    alert: { type: Boolean, default: false },
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: { type: String, default: ''},
    resetOtpExpireAt: { type: Number, default: 0 },
    subscribeUser: {
        endpoint: { type: String },
        keys: {
            p256dh: { type: String },
            auth: { type: String }
        }
    }

})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;