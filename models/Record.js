const mongoose = require("mongoose");

// define the schema
const recordSchema = new mongoose.Schema({
  records: { type: Array, required: true },
});
// {
//     date: { type: Date, required: true },
//     money: { type: Number, required: true },
//     type: { type: String, required: true },
//     description: { type: String, required: true },
// },

// exporting the schema with the collection name
module.exports = mongoose.model("records", recordSchema);
