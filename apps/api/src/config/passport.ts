import JwtStrategy from 'passport-jwt/lib/strategy';
import { ExtractJwt } from 'passport-jwt';
import { config } from './database';
import { getUserById } from '../services/users.service';

export const passportFunction = (passport) => {
    const options = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret
    }
    return passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
        const user = await getUserById(jwt_payload._id)
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }


    }))
}
