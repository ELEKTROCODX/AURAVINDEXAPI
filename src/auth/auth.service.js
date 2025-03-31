import { app_config } from '../config/app.config.js';
import { FailedToSendEmail, InvalidLogin, InvalidOrExpiredToken, ObjectAlreadyExists, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as user_repository from '../user/user.repository.js';
import * as role_repository from '../role/role.repository.js';
import { send_email } from '../config/util.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
/**
 * Registers a new user by validating the provided data and creating a user in the database.
 * 
 * @param {string} username - The username of the new user.
 * @param {string} name - The first name of the new user.
 * @param {string} last_name - The last name of the new user.
 * @param {string} email - The email address of the new user.
 * @param {string} biography - The biography of the new user.
 * @param {string} gender - The gender of the new user.
 * @param {string} favorite_book - The favorite book of the new user.
 * @param {Date} birthdate - The birthdate of the new user.
 * @param {string} user_img - The profile image URL of the new user.
 * @param {ObjectId} role - The role of the new user (if not provided, default to 'Client user').
 * @param {string} password - The password of the new user.
 * 
 * @returns {Promise<Object>} - The newly created user object.
 * 
 * @throws {ObjectAlreadyExists} - If a user with the same username or email already exists.
 */
export const register = async (username, name, last_name, email, biography, gender, favorite_book, birthdate, user_img, password) => {
    const user_exists = await user_repository.filter_users({['username']: new RegExp(username, 'i'), ['email']: new RegExp(email, 'i')}, 0, 10);
    const find_role = await role_repository.filter_roles({name: 'Client user'});
    const role = find_role[0]._id;
    if(user_exists.length != 0) {
        throw new ObjectAlreadyExists("user");
    }
    const new_user = await user_repository.create_user({username, name, last_name, email, biography, gender, favorite_book, birthdate, user_img, role, password});
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
export const login = async (email, password) => {
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
        {expiresIn: '1h'}
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
    const reset_link = `https://${app_config.app_main_domain}/reset_password?token=${reset_token}`;
    const result = await send_email(
        email, 
        'Password Reset Request',
        `
        <p>Hi <strong>[${user_data[0].name} ${user_data[0].last_name}]</strong>,</p>
        <p>We received a request to reset the password for your <strong>Aura Vindex</strong> account. If you made this request, please click the link below to set a new password:</p>
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
        <p>The Aura Vindex Team</p>
    `,
    );
    if(result.accepted.length == 0) {
        throw new FailedToSendEmail(email);
    } else {
        return true;
    }
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