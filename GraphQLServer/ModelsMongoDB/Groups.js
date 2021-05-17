const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
  groupMembers: {
    type: Array,
  },
  image: {
    type: String,
  },
  groupTransactions: {
    type: Array,
  },
},
{
  versionKey: false,
});

module.exports = mongoose.model('group', groupsSchema);
