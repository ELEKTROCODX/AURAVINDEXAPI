import express from 'express';
import * as user_controller from './user.controller.js';
import * as user_validator from './user.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';
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
const user_router = express.Router();

user_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_USER), user_controller.get_all_users);
user_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_USER), user_validator.user_validation_rules_get_id, validate, user_controller.get_user_by_id);
user_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_USER),  upload.single('user_img'), user_validator.user_validation_rules_post, validate, user_controller.create_user);
user_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_USER), upload.single('user_img'), user_validator.user_validation_rules_update, validate, user_controller.update_user);
user_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_USER), user_validator.user_validation_rules_get_id, validate, user_controller.delete_user);
/* Save a user's FCM token */
user_router.post('/:id/fcm_token/', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_USER), user_validator.user_validation_rules_fcm_token, validate, user_controller.save_fcm_token);

export {user_router};