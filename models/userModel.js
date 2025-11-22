import mongoose from "mongoose";
import pkg from 'jsonwebtoken';

const { verify, sign } = pkg;

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    region: {type: String, required: true},
    uid: { type: Number, required: true },
    alart: { type: Boolean, default: false },
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: { type: String, default: ''},
    resetOtpExpireAt: { type: Number, default: 0 }
})

const User = mongoose.models.user || mongoose.model('User', userSchema);

export default User;