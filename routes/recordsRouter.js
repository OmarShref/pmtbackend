const express = require("express");
const router = express.Router();
const joi = require("joi");
const Record = require("../models/Record");

// GET
router.get("/getall", (req, res) => {
  if (!req.user) {
    res.status(204).send();
  } else {
    Record.findOne({ _id: req.user.recordID }, (err, data) => {
      if (err) throw err;
      if (!data) {
        res.status(204).send();
      } else {
        res.status(200).send(data);
      }
    });
  }
});

// PUT
router.put("/putone", (req, res) => {
  if (!req.user) {
    res.status(204).send();
  } else {
    const body = req.body;
    const schema = joi.object({
      date: joi.date().required(),
      money: joi.number().positive().allow(0).max(1000000000000).required(),
      type: joi
        .string()
        .trim()
        .max(10)
        .valid("expenses", "income", "diaries")
        .required(),
      description: joi.string().max(300).required(),
    });
    const { error } = schema.validate(body);
    if (error) {
      res.status(200).send(error.message);
    } else {
      const newRecord = {
        date: body.date,
        money: body.money,
        type: body.type,
        description: body.description,
      };
      Record.updateOne(
        { _id: req.user.recordID },
        { $push: { records: newRecord } },
        (err, data) => {
          if (err) throw err;
          if (!data) {
            res.status(200).send("Error happened please try again");
          } else {
            res.status(201).send();
          }
        }
      );
    }
  }
});

router.put("/deleteone", (req, res) => {
  if (!req.user) {
    res.status(204).send();
  } else {
    const deleteString = "records." + req.body.index;
    Record.updateOne(
      { _id: req.user.recordID },
      { $unset: { [deleteString]: 1 } },
      (err, data) => {
        if (err) throw err;
        if (!data) {
          res.status(204).send();
        } else {
          Record.updateOne(
            { _id: req.user.recordID },
            { $pull: { records: null } },
            (err, data) => {
              if (err) throw err;
              if (!data) {
                res.status(204).send();
              } else {
                res.status(200).send("deleted successfully");
              }
            }
          );
        }
      }
    );
  }
});

//exporting the router
module.exports = router;
