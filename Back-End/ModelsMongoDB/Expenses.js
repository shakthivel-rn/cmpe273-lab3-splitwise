const mongoose = require('mongoose');

const { Schema } = mongoose;

const expensesSchema = new Schema({
  groupName: {
    type: String,
    required: true,
  },
  expenseDescription: {
    type: String,
    required: true,
  },
  expenseAmount: {
    type: Number,
    required: true,
  },
  comments: {
    type: Array,
  },
},
{
  versionKey: false,
});

module.exports = mongoose.model('expense', expensesSchema);
