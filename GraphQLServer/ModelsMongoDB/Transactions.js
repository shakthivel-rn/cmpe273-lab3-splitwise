const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionsSchema = new Schema({
  groupName: {
    type: String,
    required: true,
  },
  expenseId: {
    type: mongoose.ObjectId,
    required: true,
  },
  expenseDescription: {
    type: String,
    require: true,
  },
  expenseAmount: {
    type: Number,
    required: true,
  },
  paidUserId: {
    type: mongoose.ObjectId,
    required: true,
  },
  owedUserId: {
    type: mongoose.ObjectId,
    required: true,
  },
  splitAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: Boolean,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
},
{
  versionKey: false,
});

module.exports = mongoose.model('transaction', transactionsSchema);
