import express from 'express';
import { authController } from './auth.controller.js';
import verifyToken from '../../Middlewers/verifyToken.js';
const authRouter = express.Router();

authRouter.post('/signup', authController.userSignupControle)
authRouter.post('/signin', authController.userLoginControle)
authRouter.get('/my-profile', verifyToken ,authController.getProfileController)
authRouter.post('/signout', authController.userLoggetOut)

export default authRouter;