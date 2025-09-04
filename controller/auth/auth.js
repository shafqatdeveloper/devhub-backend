import { resetPasswordHTML } from "../../helpers/emails/resetPasswordTemplate.js";
import { verifyEmailHTML } from "../../helpers/emails/verfiyEmailTemplate.js";
import { loginSchema, registerSchema } from "../../helpers/validation/userValidation.js";
import User from "../../models/user/User.js";
import { sendEmail } from "../../utils/mailer.js";
import { sha256Hash, signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../utils/token.js";
import crypto from "crypto";

const PROD = process.env.NODE_ENV === "production";

const cookieBase = {
  httpOnly: true,
  secure: true,               
  sameSite: "none",            
  domain: ".devhub-one-tau.vercel.app",
  path: "/",
  maxAge: 60 * 60 * 24 * 7
};


function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie('access_token', accessToken, cookieBase);
    res.cookie('refresh_token', refreshToken, cookieBase);
}

function clearAuthCookies(res) {
    res.clearCookie('access_token', cookieBase);
    res.clearCookie('refresh_token', cookieBase);
}


function setVerificationToken(user) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.verificationToken = hashed;
  user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  return rawToken;
}


function setResetPasswordToken(user, { ttlMs = 60 * 60 * 1000 } = {}) {
  const rawToken = crypto.randomBytes(32).toString("hex")
  const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordToken = hashed;
  user.resetPasswordTokenExpires = new Date(Date.now() + ttlMs);

  return rawToken;
}


export const registerUser = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const {
      name, username, email, password,
      bio, avatar, location, website,
      skills, github, twitter, linkedin, portfolio,
      confirmPassword
    } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ error: "User already exists" });

    const user = new User({
      name, username, email, password,
      bio, avatar, location, website,
      skills, github, twitter, linkedin, portfolio
    });

    const rawToken = setVerificationToken(user);
    await user.save();
    const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;

    const html = verifyEmailHTML({ name: user.name || user.username, verifyUrl });
    await sendEmail({
      to: user.email,
      subject: "Verify your Developers Hub email",
      html,
    });

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.verificationToken;
    delete safeUser.verificationTokenExpires;

    res.status(201).json({
      message: "User registered. Please check your email to verify your account.",
      user: safeUser,
    });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;
    if (!token || !email) return res.status(400).json({ error: "Invalid verification request" });

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email,
      verificationToken: hashed,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Verification link is invalid or has expired" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("verifyEmail error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if(!user){
      return res.status(401).json({ message: "Unable to Find Account" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified." });
    }

    const rawToken = setVerificationToken(user);
    await user.save({ validateBeforeSave: false });

    const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;

    const html = verifyEmailHTML({ name: user.name || user.username, verifyUrl });
    await sendEmail({
      to: user.email,
      subject: "Verify your Developers Hub email",
      html,
    });

    return res.status(200).json({
      message: "Verification email resent. Please check your inbox.",
    });
  } catch (err) {
    console.error("resendVerification error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const loginUser = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        const { emailOrUsername, password } = req.body;
        console.log(emailOrUsername, password);
        const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] }).select("+password");
        console.log(user);
        if (!user) return res.status(400).json({ error: "Invalid credentials" });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
        const returningUser = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] }).select("-password").select("-refreshTokenHash");
        const payload = { sub: String(returningUser._id), email: returningUser.email, name: returningUser.name, role: returningUser.name };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);
        returningUser.refreshTokenHash = sha256Hash(refreshToken);
        await returningUser.save();
        setAuthCookies(res, accessToken, refreshToken);
        res.status(200).json({ message: "Login successful", returningUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const refreshAuthToken = async(req,res)=>{
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) return res.status(401).json({ error: "No refresh token provided" });
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.sub)
        if(!user || !user.refreshTokenHash) return res.status(401).json({ error: "Invalid refresh token" });
        const matches = user.refreshTokenHash === sha256Hash(refreshToken);
        if (!matches) return res.status(401).json({ error: "Invalid refresh token" });
        const payload = { sub: String(user._id), email: user.email, name: user.name, role: user.name };
        const newAccessToken = signAccessToken(payload);
        user.refreshTokenHash = sha256Hash(refreshToken);
        await user.save()
        setAuthCookies(res, newAccessToken, refreshToken);
        return res.json({ok: true})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const logoutUser = async(req,res)=>{
    try {
        const refreshToken = req.cookies.refresh_token;
        if(refreshToken){
            try {
              const decoded = verifyRefreshToken(refreshToken)  
              await User.findByIdAndUpdate(decoded.sub, { $set: { refreshTokenHash: null } });
            } catch{
            }
            clearAuthCookies(res);
            return res.json({ ok: true });
        }else{
            return res.status(401).json({ error: "Not Logged In" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const loggedInUser = async(req,res)=>{
    try {
        const accessToken = req.cookies.access_token;
        if(!accessToken) return res.status(401).json({ error: "No access token provided" });
        const decoded= verifyAccessToken(accessToken);
        const user = await User.findById(decoded.sub).select("-password").select("-refreshTokenHash");
        if(!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ user });
        return res.status(200).json({ ok: true,user });
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}





export const forgotPassword = async (req, res) => {
  const { email } = req.body || {};
  console.log(email);
  const genericMsg =
    "If an account with that email exists, a reset link has been sent.";
  if (!email || typeof email !== "string") {
    return res.status(200).json({ message: genericMsg });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Unable to Find Account" });
    }

    const rawToken = setResetPasswordToken(user);
    await user.save({ validateBeforeSave: false });

    const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(
      email
    )}`;

    const html = resetPasswordHTML({
      name: user.name || user.username || "there",
      resetUrl,
    });

    await sendEmail({
      to: user.email,
      subject: "Reset your Developers Hub password",
      html,
    });

    return res.status(200).json({ message: genericMsg });
  } catch (err) {
    console.error("sendPasswordReset error:", err);

    try {
      await User.updateOne(
        { email },
        { $unset: { resetPasswordToken: "", resetPasswordTokenExpires: "" } }
      );
    } catch (_) {}

    return res.status(500).json({ error: "Internal server error" });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body || {};

    if (!token || !email || !password) {
      return res.status(400).json({ error: "Missing token, email, or password" });
    }

    // Hash incoming token to compare with DB (same pattern as verifyEmail)
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordToken: hashed,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Reset link is invalid or has expired" });
    }

    // Set the new password. (Assumes your User model hashes on save via pre('save') hook)
    user.password = password;

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;

    // Optional: track password change for JWT invalidation on refresh tokens, etc.
    user.passwordChangedAt = new Date();

    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("resetPasswordConfirm error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};