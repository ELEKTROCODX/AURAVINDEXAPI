import passport from 'passport';
import * as localStrategy from './localStrategy.js';
import * as jwtStrategy from './jwtStrategy.js';
import * as user_repository from '../../user/user.repository.js';

passport.use(localStrategy.localStrategy);
passport.use(jwtStrategy.jwtStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await user_repository.find_user_by_id(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
