import express from 'express';
import { addAssistant, banUser, changePassword, changeUserPassword, changeVisibility, checkAdmin, deleteAccount, deleteUser, employeeProfileRequests, getAssistants, getPendingProfileRequests, isAuthenticated, login, logout, register, resetPasswordWithOTP, sendPasswordResetOTP, sendPhoneVerificationOtp, unBanUser, updateRecruiterStatus, verifyEmail, verifyPasswordResetOTP, verifyPhone } from '../controllers/authController.js';
import userAuth from '../middlewares/userAuth.js';

const authRouter = express.Router()

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get("/is-auth", userAuth, isAuthenticated)
authRouter.get('/check-admin', userAuth, checkAdmin);
authRouter.post('/verify-account', verifyEmail);
authRouter.post('/delete-user', deleteUser);
authRouter.post('/change-password', changePassword);
authRouter.post('/change-user-password', userAuth, changeUserPassword);
authRouter.post('/delete-account', deleteAccount);
authRouter.post('/ban-user', banUser);
authRouter.post('/unban-user', unBanUser);
authRouter.post('/update-employee-status', updateRecruiterStatus);
authRouter.post('/employee-profile-request', employeeProfileRequests);
authRouter.get('/get-profile-request', getPendingProfileRequests);
authRouter.post('/change-visibility', changeVisibility);
authRouter.post('/add-assistant', userAuth, addAssistant);
authRouter.get('/get-assistants', userAuth, getAssistants);
authRouter.post('/send-password-reset-otp', sendPasswordResetOTP);
authRouter.post('/verify-password-reset-otp', verifyPasswordResetOTP);
authRouter.post('/reset-password-with-otp', resetPasswordWithOTP);
authRouter.post('/send-phone-verification-otp', userAuth, sendPhoneVerificationOtp);
authRouter.post('/verify-phone',userAuth,  verifyPhone);

export default authRouter;