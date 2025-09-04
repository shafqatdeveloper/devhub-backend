import express from 'express'
import { forgotPassword, loggedInUser, loginUser, logoutUser, refreshAuthToken, registerUser, resendVerificationEmail, resetPassword, verifyEmail } from '../../controller/auth/auth.js';


const router = express.Router();

router.post("/auth/register",registerUser)
router.post("/auth/login",loginUser)
router.post("/auth/logout",logoutUser)
router.get("/auth/me",loggedInUser)
router.get("/auth/refresh",refreshAuthToken)
router.patch("/auth/verify-email",verifyEmail)
router.post("/auth/resend-verification",resendVerificationEmail)
router.post("/auth/forgot-password",forgotPassword)
router.post("/auth/reset-password",resetPassword)


export default router