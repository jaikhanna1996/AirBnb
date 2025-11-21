const path = require('path');
const authController = require('../controllers/auth');


const express = require("express");
const authRouter = express.Router();


authRouter.get('/login', authController.getLogin);
authRouter.post('/login', authController.postLogin);

authRouter.get('/signup', authController.getSignup);
authRouter.post('/signup', ...authController.validateSignup, authController.postSignup);

authRouter.post('/logout', authController.postLogout);

module.exports = authRouter;