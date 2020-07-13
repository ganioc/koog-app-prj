const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  action: {
    type: Number,  // 1, create, 2, edit, 3, delete
    required: true
  },
  creator:{
    type: String,  // 操作usnername
    required: true,
    index: true
  },
  username: {
    type: String,  // 操作usnername
    required: true,
    index: true
  },
  date: {
    type: Date,
    index: true,
    required: true
  },
  verb: {
    type: String
  },
  oldstate:{
    type: String
  },
  newstate: {
    type: String,
  }
})

let ActionModel = mongoose.model("Action", actionSchema)

module.exports = ActionModel