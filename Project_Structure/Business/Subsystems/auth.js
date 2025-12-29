require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.FRONTEND_URL,
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    return done(err, user);
  }
));

passport.serializeUser(function(user, done){
    done(null,user);
});

passport.deserializeUser(function(user, done){
    done(null,user);
});

function sessionAuth(user, SessionID){
  //This function will validate if a user still has a current active session Cookie
  /*Functionality:
    -Pulls up user sessionID in database
    -compares the sessionID passed in with the database's current SessionID, if they don't match dont let them login otherwise authenticate them

    Find a way to cache the authentification so they dont have to constantly reauthenticate. maybe just issue a session token to stay logged in
    This also means I need to make a new table that is linked to the user table    
  */
}