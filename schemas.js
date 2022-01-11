const mongoose = require('mongoose');

//Schemas.
const articleSchema = new mongoose.Schema({
    user_ID: {type: String, required: true},
    name:{type: String, required: true},
    author:{type: String, required: true},
    price:{type: String, required: true},
    amount:{type: String, required: true},
    description:{type: String, required: true},
    url:{type: String, required: true}
}, {
    timestamps: true
});


var modulesToExport = {Article: mongoose.model('Article', articleSchema)};
module.exports = modulesToExport;