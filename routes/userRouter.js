const express = require("express");
const router = express.Router();
const joi = require("joi");
const User = require("../models/User");
const Record = require("../models/Record");
const CheckList = require("../models/CheckList");
const passport = require("passport");
const bcrypt = require("bcrypt");

// get requests
router.get("/user", (req, res) => {
  if (!req.user) {
    res.status(204).send();
  } else {
    res.status(200).send(req.user);
  }
});

router.get("/logout", (req, res) => {
  req.logOut((err) => console.log(err));
  res.status(200).send();
});

// post requests
router.post("/register", (req, res) => {
  const body = req.body;

  User.findOne({ username: body.username }, async (err, doc) => {
    if (err) {
      throw err;
    }
    if (doc) {
      res.status(204).send();
    } else {
      // initializing new record and checklist for the user
      let newRecord = {
        records: [],
      };
      let newCheckList = {
        checkLists: [],
      };
      // adding new record and checklist for the user to db
      await Record.insertMany(newRecord)
        .then((data) => {
          newRecord = data[0];
        })
        .catch((err) => console.log(err));

      await CheckList.insertMany(newCheckList)
        .then((data) => {
          newCheckList = data[0];
        })
        .catch((err) => console.log(err));

      const userSchema = joi.object({
        username: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
      });

      const { error } = userSchema.validate(body);

      if (error) {
        console.log("error : ", error.message);
      } else {
        const newUser = {
          username: body.username,
          email: body.email,
          password: body.password,
          balance: 0,
          recordID: newRecord._id,
          checklistID: newCheckList._id,
        };
        bcrypt.hash(newUser.password, 10, async (err, hash) => {
          newUser.password = hash;
          User.insertMany(newUser)
            .then(() => res.status(201).send())
            .catch((err) => res.status(500).send(err));
        });
      }
    }
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) throw err;
    if (!user) res.status(204).send();
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.status(200).send();
      });
    }
  })(req, res, next);
});

//exporting the router
module.exports = router;
