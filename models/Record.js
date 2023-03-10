const mongoose = require("mongoose");

// define the schema
const recordSchema = new mongoose.Schema({
  records: { type: Array, required: true },
});

// exporting the schema with the collection name
module.exports = mongoose.model("records", recordSchema);
