import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import PhoneOtp from "../models/PhoneOtp.js";
import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function normalizePhone(rawPhone = "") {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}

async function sendSmsOtp(phone, otp) {
  console.log(`[PREP-DESK SMS OTP] To ${phone}: ${otp}`);
}

// 1. Send Phone OTP
router.post("/send-phone-otp", async (req, res) => {
  try {
    const { name, phone } = req.body;
    const normalizedPhone = normalizePhone(phone);

    if (!/^\+91[6-9]\d{9}$/.test(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit Indian mobile number.",
      });
    }

    const existingUser = await User.findOne({ phone: normalizedPhone });
    if (!existingUser && !name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required for new registration.",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PhoneOtp.findOneAndUpdate(
      { phone: normalizedPhone },
      {
        name: name?.trim() || existingUser?.name || "Student",
        phone: normalizedPhone,
        otpHash,
        attempts: 0,
        expiresAt,
      },
      { upsert: true, new: true }
    );

    await sendSmsOtp(normalizedPhone, otp);

    return res.status(200).json({
      success: true,
      phone: normalizedPhone,
      message: "OTP sent to your phone number.",
    });
  } catch (err) {
    console.error("SEND PHONE OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP.",
    });
  }
});

// 2. Verify Phone OTP
router.post("/verify-phone-otp", async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone || !otp?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number and 6-digit OTP are required.",
      });
    }

    const record = await PhoneOtp.findOne({ phone: normalizedPhone });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found. Please request again.",
      });
    }

    if (record.attempts >= 5) {
      await PhoneOtp.deleteOne({ _id: record._id });
      return res.status(429).json({
        success: false,
        message: "Too many wrong attempts. Request a new OTP.",
      });
    }

    const valid = await bcrypt.compare(otp.trim(), record.otpHash);
    if (!valid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    let user = await User.findOne({ phone: normalizedPhone });
    if (!user) {
      user = await User.create({
        name: name?.trim() || record.name,
        phone: normalizedPhone,
        isPhoneVerified: true,
        role: "student",
      });
    } else if (!user.isPhoneVerified) {
      user.isPhoneVerified = true;
      await user.save();
    }

    await PhoneOtp.deleteOne({ _id: record._id });
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Phone verified successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("VERIFY PHONE OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP.",
    });
  }
});

// 3. Continue with Google (Gmail)
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required.",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const name = payload.name || email?.split("@")[0] || "Student";

    if (!email || !payload.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Verified Google email is required.",
      });
    }

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        isEmailVerified: true,
        role: "student",
      });
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (!user.email) user.email = email;
      user.isEmailVerified = true;
      await user.save();
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Signed in with Gmail successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired Google login token.",
    });
  }
});

// 4. Current User
router.get("/me", protect, async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    },
  });
});

export default router;