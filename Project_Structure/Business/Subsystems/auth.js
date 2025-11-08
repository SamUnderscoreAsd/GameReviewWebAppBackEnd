require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/",
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

    TODO: modify/recreate the database table with a second table for sessionTokens. Make a primary key the emails in the user table and the emails again in the token table
    
  */
}