const mongoose = require('mongoose');

const msgtonSchema = new mongoose.Schema({

  creator: {
    type: String,
    requried: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    index: true
  },
  pknum: {
    type: Number,
    required: true
  },
  pktotal: {
    type: Number,
    required: true
  },
  mobile: {
    type: String,
    required: true,
  },
  msg_id: {
    type: String,
    required: true,
    index: true
  },
  batch_id: {
    type: String,
    required: true,
  },
  x_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    index: true,
    required: true
  },
  status: {
    type: Number,
    index: true,

  }
});

let MsgtonModel = mongoose.model('Msgton', msgtonSchema);

module.exports = MsgtonModel;

