const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  content: {
    type: String,
    minlength: 3,
    maxlength: 280,
    required: true
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
    //required: true
  },
  picPath: {
    type: String
  },
  picName: {
    type: String
  }
});

module.exports = model('Post', postSchema);
