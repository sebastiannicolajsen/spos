import passport = require("passport");


export const jwtAuth = passport.authenticate('jwt', { session: false });