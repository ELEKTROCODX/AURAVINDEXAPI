import { app_config } from '../config/app.config.js';
import { FailedToSendEmail, InvalidLogin, InvalidOrExpiredToken, InvalidPasswordReset, ObjectAlreadyExists, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as auth_service from './auth.service.js';
import * as user_service from '../user/user.service.js';
import * as book_list_service from '../book_list/book_list.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';

/**
 * Controller action to register a new user by invoking the service layer.
 * 
 * @param {Object} req - The request object, containing the user data in `req.body`.
 * @param {Object} res - The response object used to send the status and response.
 * 
 * @returns {void}
 * 
 * @throws {ObjectAlreadyExists} - If the user already exists with the provided email.
 */
export const register = async (req, res) => {
    try {
        const {name, last_name, email, biography, gender, address, birthdate, password} = req.body;
        const user_img = req.file ? `/images/users/${req.file.filename}` : app_config.DEFAULT_USER_IMG_PATH;
        await auth_service.register(name, last_name, email, biography, gender, birthdate, user_img, address, password);
        const user_data = await user_service.filter_users('email', email, 0, 10);
        await book_list_service.create_new_book_list({title: 'Favorites', description: 'My favorite books.', owner: user_data.data[0]._id, books: []});
        await audit_log_service.create_new_audit_log(user_data.data[0]._id, app_config.PERMISSIONS.SIGNUP, email);
        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error registering user', error: error.message});
    }
}
/**
 * Controller action to log in a user by validating the credentials and returning a JWT token.
 * 
 * @param {Object} req - The request object, containing the email and password in `req.body`.
 * @param {Object} res - The response object used to send the status and response.
 * 
 * @returns {void}
 * 
 * @throws {InvalidLogin} - If the login credentials are invalid.
 */
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const token = await auth_service.login(email, password);
        const user_data = await user_service.filter_users('email', email, 1, 1);
        await audit_log_service.create_new_audit_log(user_data.data[0]._id, app_config.PERMISSIONS.SIGNIN, user_data.data[0].email);
        res.status(200).json({message: 'Successfully logged in', token});
    } catch (error) {
        if(error instanceof InvalidLogin) {
            return res.status(401).json({message: error.message});
        }
        res.status(500).json({message: 'Error logging in user', error: error.message});
    }
}
/**
 * Handles the password reset request by triggering the email service to send a password reset email.
 *
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @throws {ObjectMissingParameters} If the email parameter is missing.
 * @throws {FailedToSendEmail} If the email service fails to send the email.
 * @returns {void} Sends a JSON response indicating success or failure of the email operation.
 */
export const request_password_reset = async (req, res) => {
    try {

        const { email } = req.body;
        const response = await auth_service.request_password_reset(email);
        const user_data = await user_service.filter_users('email', email, 1, 1);
        await audit_log_service.create_new_audit_log(user_data.data[0]._id, app_config.PERMISSIONS.REQUEST_PASSWORD_RESET, user_data.data[0].email);
        if(response) {
            res.status(200).json({ message: 'Password reset sent to email' });
        } else {
            res.status(500).json({message: 'Failed to send email'});
        }
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof FailedToSendEmail) {
            return res.status(500).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        res.status(500).json({message: 'Error requesting password reset', error: error.message});
    }
}
/**
 * Resets the user's password using a token and a new password, and returns the operation's result.
 *
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @throws {ObjectMissingParameters} If the token or password is missing.
 * @throws {InvalidPasswordReset} If the old password does not match or the reset request is invalid.
 * @throws {InvalidOrExpiredToken} If the provided token is invalid or has expired.
 * @throws {ObjectNotFound} If the user associated with the token is not found.
 * @returns {void} Sends a JSON response indicating the success or failure of the password reset operation.
 */
export const reset_password = async (req, res) => {
    try {
        const { token, password } = req.body;
        const password_reset = await auth_service.reset_password(token, password);        
        await audit_log_service.create_new_audit_log(password_reset._id, app_config.PERMISSIONS.RESET_PASSWORD, password_reset.email);
        res.status(200).json({message: 'User password reset successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof InvalidPasswordReset) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof InvalidOrExpiredToken) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        res.status(500).json({message: 'Error resetting password', error: error.message});
    }
}

/* CLOSE ACCOUNT REQUEST */