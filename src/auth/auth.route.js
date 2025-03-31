import express from 'express';
import * as auth_validator from './auth.validator.js';
import * as user_validator from '../user/user.validator.js';
import * as auth_controller from './auth.controller.js';
import validate from '../middleware/validation.middleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/users/');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.email + ".png");
    }
});
const upload = multer({storage: storage});
const auth_router = express.Router();

auth_router.post('/register/', upload.single('user_img'), user_validator.user_validation_rules_post, validate, auth_controller.register);
auth_router.post('/login/', auth_validator.login_validation_rules, validate, auth_controller.login);
auth_router.post('/reset/', auth_validator.user_validation_rules_request_password_reset, validate, auth_controller.request_password_reset);
auth_router.post('/reset_password/', auth_validator.user_validation_rules_reset_password, validate, auth_controller.reset_password);

export {auth_router};