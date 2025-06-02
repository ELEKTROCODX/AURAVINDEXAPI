import { app_config } from '../config/app.config.js';
import { FailedToSendEmail, InvalidLogin, InvalidOrExpiredToken, ObjectAlreadyExists, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as user_repository from '../user/user.repository.js';
import * as role_repository from '../role/role.repository.js';
import * as recent_book_repository from '../recent_book/recent_book.repository.js';
import * as book_list_repository from '../book_list/book_list.repository.js';
import { send_email } from '../config/util.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { recent_book } from '../recent_book/recent_book.model.js';
/**
 * Registers a new user by validating the provided data and creating a user in the database.
 * 
 * @param {string} name - The first name of the new user.
 * @param {string} last_name - The last name of the new user.
 * @param {string} email - The email address of the new user.
 * @param {string} biography - The biography of the new user.
 * @param {string} gender - The gender of the new user.
 * @param {Date} birthdate - The birthdate of the new user.
 * @param {string} user_img - The profile image URL of the new user.
 * @param {ObjectId} role - The role of the new user (if not provided, default to 'Client user').
 * @param {string} password - The password of the new user.
 * 
 * @returns {Promise<Object>} - The newly created user object.
 * 
 * @throws {ObjectAlreadyExists} - If a user with the same email already exists.
 */
export const register = async (name, last_name, email, biography, gender, birthdate, user_img, address, password) => {
    const user_exists = await user_repository.filter_users({['email']: new RegExp(email, 'i')}, null, null);
    const find_role = await role_repository.filter_roles({name: 'Client user'});
    const role = find_role[0]._id;
    if(user_exists.length != 0) {
        throw new ObjectAlreadyExists("user");
    }
    if(!user_img) user_img = app_config.DEFAULT_USER_IMG_PATH;
    const new_user = await user_repository.create_user({name, last_name, email, biography, gender, birthdate, user_img, address, role, password});
    const user_data = await user_repository.filter_users({['email']: new RegExp(email, 'i')}, 0, 10);
    await book_list_repository.create_book_list({title: 'Favorites', description: 'My favorite books.', owner: user_data[0]._id, books: []});
    await recent_book_repository.create_recent_book({user: user_data[0]._id, books: []});
    return new_user;
}
/**
 * Authenticates a user by verifying the provided credentials and generating a JWT token.
 * 
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * 
 * @returns {Promise<string>} - The generated JWT token.
 * 
 * @throws {InvalidLogin} - If the email or password is incorrect, or user doesn't exist.
 */
export const login = async (email, password, expires_in) => {
    const user = await user_repository.filter_users({['email']: new RegExp(email, 'i')}, 0, 10);
    if(user.length != 1){
        throw new InvalidLogin();
    }
    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if(!isValidPassword) {
        throw new InvalidLogin();
    }
    const token = jwt.sign(
        {id: user[0]._id, email: user[0].email, role: user[0].role},
        app_config.jwtSecret,
        {expiresIn: expires_in}
    );
    return token;
}
/**
 * Sends a password reset email to the user with the given email address.
 *
 * @param {string} email - The email address of the user requesting a password reset.
 * @throws {ObjectMissingParameters} If the email parameter is missing.
 * @throws {ObjectNotFound} If no user with the given email address is found.
 * @throws {FailedToSendEmail} If the email fails to send.
 * @returns {boolean} True if the email was sent successfully.
 */
export const request_password_reset = async (email) => {
    if(!email) {
        throw new ObjectMissingParameters("user");
    }    
    const user_data = await user_repository.filter_users({'email': new RegExp(email, 'i')}, 0, 10);
    if(!user_data.length != 0) {
        throw new ObjectNotFound("user");
    }    
    
    const reset_token = jwt.sign(
        {id: user_data[0]._id, email: user_data[0].email, role: user_data[0].role},
        app_config.jwtSecret,
        {expiresIn: '15m'}
    );
    const reset_link = `https://${app_config.app_main_domain}/reset_password.html?token=${reset_token}`;
    const result = await send_email(
        email, 
        'Password Reset Request [AURA VINDEX]',
        `
        <p>Hi <strong>[${user_data[0].name} ${user_data[0].last_name}]</strong>,</p>
        <p>We received a request to reset the password for your <strong>AURA VINDEX</strong> account. If you made this request, please click the link below to set a new password:</p>
        <p style="text-align: center;">
            <a href="${reset_link}" style="
                display: inline-block;
                background-color: #007BFF;
                color: white;
                text-decoration: none;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
            ">Reset Password</a>
        </p>
        <p>This link will expire in <strong>15 minutes</strong>. If you didn't request a password reset, you can safely ignore this email—your account will remain secure.</p>
        <p>If you have any questions or need further assistance, feel free to reach out to our support team at <a href="mailto:${app_config.app_support_email}">${app_config.app_support_email}</a>.</p>
        <br>
        <p>Best regards,</p>
        <p>The AURA VINDEX Team</p>
    `,
    );
    if(!result) {
        throw new FailedToSendEmail();
    }
    return true;
}
/**
 * Resets a user's password using a token and a new password.
 *
 * @param {string} token - The password reset token.
 * @param {string} password - The new password for the user.
 * @throws {ObjectMissingParameters} If the token or password parameter is missing.
 * @throws {InvalidOrExpiredToken} If the token is invalid or expired.
 * @throws {ObjectNotFound} If the user associated with the token is not found.
 * @returns {Promise<Object>} The updated user data after the password is reset.
 */
export const reset_password = async (token, password) => {
    var decoded = null;
    if(!token || !password) {
        throw new ObjectMissingParameters("user");
    }
    try {
        decoded = jwt.verify(token, app_config.jwtSecret);
    } catch (error) {
        decoded = null;
    }
    if(!decoded) {
        throw new InvalidOrExpiredToken();
    }
    const user_data = await user_repository.find_user_by_id(decoded.id);
    if(!user_data) {
        throw new ObjectNotFound("user");
    }
    user_data.password = password;
    return await user_repository.update_user(decoded.id, user_data);    
}