const mongoose = require("mongoose");

const DirigenteSchema = new mongoose.Schema({
    name: String,
    phone: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

module.exports = mongoose.model("Dirigente", DirigenteSchema);
