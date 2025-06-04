import express from 'express';
import * as book_controller from './book.controller.js';
import * as book_validator from './book.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware, optional_auth_middlelware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/books/');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.classification + ".png");
    }
});
const upload = multer({storage: storage});
const book_router = express.Router();

/* book_router.get('/', permision_required(config.permison.create_book), book_controller.get_all_books); */
book_router.get('/', book_controller.get_all_books);
book_router.get('/latest_releases/', book_controller.get_latest_releases)
book_router.get('/:id', optional_auth_middlelware, book_validator.book_validation_rules_get_id, validate, book_controller.get_book_by_id);
book_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_BOOK), upload.single('book_img'), book_validator.book_validation_rules_post, validate, book_controller.create_book);
book_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_BOOK), upload.single('book_img'), book_validator.book_validation_rules_update, validate, book_controller.update_book);
book_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_BOOK), book_validator.book_validation_rules_get_id, validate, book_controller.delete_book);

export {book_router};