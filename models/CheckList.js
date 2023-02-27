const mongoose = require("mongoose");

// define the schema
const checklistSchema = new mongoose.Schema({
  checkLists: { type: Array, required: true },
});
// {
//   title: { type: String, required: true },
//   items: [
//     {
//       description: { type: String, required: true },
//       checked: { type: Boolean, required: true },
//     },
//   ],
// },

// exporting the schema with the collection name
module.exports = mongoose.model("checklists", checklistSchema);
