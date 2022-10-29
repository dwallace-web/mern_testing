const mongoose = require("mongoose");

//Docs - https://www.npmjs.com/package/mongoose

const goalSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Please add text value"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Goal', goalSchema);
