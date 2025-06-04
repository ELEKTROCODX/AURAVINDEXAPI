import express from 'express';
import * as import_controller from './import.controller.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const import_router = express.Router();

import_router.put('/', import_controller.import_default_data);

export {import_router};