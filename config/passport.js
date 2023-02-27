const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");

//implement strategy
module.exports = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await User.findOne({ username: username }).catch((err) =>
        done(err)
      );

      if (!user) {
        done(null, false);
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) done(null, user);
          else done(null, false);
        });
      }
    })
  );

  //serialize user
  passport.serializeUser((user, done) => done(null, user.id)); //could it be anything other than id?

  //deserialize user
  passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({ _id: id }); //why didn't i check for user msh momkn yeb2a 7asl error fa mayb2ash mawgod fi el session
    done(null, user);
  });
};
