import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import * as user_repository from '../../user/user.repository.js';

export const localStrategy = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            const user = await user_repository.filter_users({['email']: new RegExp(email, 'i')}, 0, 10);
            if (!user[0]) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);
