const mongoose = require("mongoose");

// define the schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, required: true },
  recordID: { type: String, required: true },
  checklistID: { type: String, required: true },
});

// exporting the schema with the collection name
module.exports = mongoose.model("users", userSchema);
