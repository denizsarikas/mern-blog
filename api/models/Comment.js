const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const CommentSchema = new Schema({
    username:String,
    comment:String,
    id:String,
},{
    timestamps: true,
});

const CommentModel = model('Comment', CommentSchema);

module.exports = CommentModel;