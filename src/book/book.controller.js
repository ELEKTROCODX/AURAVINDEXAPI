import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as book_service from './book.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import * as recent_book_service from '../recent_book/recent_book.service.js';
/**
 * Controller for creating a new book.
 * 
 * @param {Object} req - The request object containing the book details in the body.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 */
export const create_book = async (req, res) => {    
    const {title, isbn, classification, summary, editorial, language, edition, sample, location, book_status, genres, book_collection, authors} = req.body;
    try {
        const book_img = req.file ? `/images/books/${req.file.filename}` : app_config.DEFAULT_BOOK_IMG_PATH;
        await book_service.create_new_book(title, isbn, classification, summary, editorial, language, edition, sample, location, book_status, genres, book_collection, authors, book_img);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_BOOK, classification);
        res.status(201).json({message: 'Book registered successfully'});
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating book', error: error.message});
    }
}
/**
 * Controller for fetching all books with optional filters and pagination.
 * 
 * @param {Object} req - The request object containing the filter fields and pagination in query parameters.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 */
export const get_all_books = async (req, res) => {
    try {
        const { filter_field, filter_value, show_duplicates = true, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const books = await book_service.get_all_books(show_duplicates, page, limit);
            res.json(books);
        } else {
            const books = await book_service.filter_books(show_duplicates, filter_field, filter_value, page, limit);
            res.json(books);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching books', error: error.message});
    }
}
/**
 * Controller for fetching a book by its ID.
 * 
 * @param {Object} req - The request object containing the book ID in the URL parameters.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 */
export const get_book_by_id = async (req, res) => {
    try {
        const book_id = req.params.id;
        const book = await book_service.get_book_by_id(book_id);
        if(req.user && req.user.id) {
            await recent_book_service.add_book_to_list(req.user.id, book_id);
        }
        res.json(book);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching book by ID', error: error.message});
    }
}
/**
 * Controller for updating a book's details.
 * 
 * @param {Object} req - The request object containing the book ID in the URL parameters and updates in the body.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 */
export const update_book = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        if(req.file) {
            const book_data = await book_service.get_book_by_id(id);
            const old_image_path = path.join(__dirname, '..', 'public', book_data.book_img);
            if((book_data.book_img !== app_config.DEFAULT_BOOK_IMG_PATH) && (fs.existsSync(old_image_path))) {
                fs.unlinkSync(old_image_path);
            }
            const new_image_path = req.file ? `/images/books/${req.file.filename}` : app_config.DEFAULT_BOOK_IMG_PATH;
            updates.book_img = new_image_path;
        }
        await book_service.update_book(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_BOOK, id);
        res.json({message: 'Book updated successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error updating book', error: error.message});
    }
}
/**
 * Controller for deleting a book by its ID.
 * 
 * @param {Object} req - The request object containing the book ID in the URL parameters.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 */
export const delete_book = async (req, res) => {
    try {
        const id = req.params.id;
        await book_service.delete_book(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_BOOK, id);
        res.json({message: 'Book deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting book', error: error.message});
    }
}