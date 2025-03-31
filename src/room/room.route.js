import express from 'express';
import * as room_controller from './room.controller.js';
import * as room_validator from './room.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/rooms/');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name + ".png");
    }
});
const upload = multer({storage: storage});
const room_router = express.Router();

room_router.get('/', room_controller.get_all_rooms);
room_router.get('/:id', room_validator.room_validation_rules_get_id, validate, room_controller.get_room_by_id);
room_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_ROOM), upload.single('room_img'), room_validator.room_validation_rules_post, validate, room_controller.create_room);
room_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_ROOM), upload.single('room_img'), room_validator.room_validation_rules_update, validate, room_controller.update_room);
room_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_ROOM), room_validator.room_validation_rules_get_id, validate, room_controller.delete_room);

export {room_router};