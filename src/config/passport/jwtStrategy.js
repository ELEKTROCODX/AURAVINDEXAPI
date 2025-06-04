import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as user_repository from '../../user/user.repository.js';
import {app_config} from '../app.config.js';

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: app_config.jwtSecret, 
};

export const jwtStrategy = new JwtStrategy(options, async (jwtPayload, done) => {
    try {
        const user = await user_repository.find_user_by_id(jwtPayload.id);

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
});

