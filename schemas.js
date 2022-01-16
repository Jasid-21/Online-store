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

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
}, {
    timestamps: true
});

const sessionSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    username: {type: String, required: true},
    nav_id: {type: String, required: true},
    session_token: {type: String, required: true}
});

var modulesToExport = {
    Article: mongoose.model('Article', articleSchema),
    User: mongoose.model('User', userSchema),
    Session: mongoose.model('Session', sessionSchema)
};
module.exports = modulesToExport;