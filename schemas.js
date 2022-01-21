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
    session_id: {type: String, required: true},
    user_id: {type: String, required: true},
    username: {type: String, required: true},
});

const friendSchema = new mongoose.Schema({
    user1: {type: String, required: true},
    user2: {type: String, required: true}
})

var modulesToExport = {
    Article: mongoose.model('Article', articleSchema),
    User: mongoose.model('User', userSchema),
    Session: mongoose.model('Session', sessionSchema),
    Friend: mongoose.model('Friend', friendSchema)
};
module.exports = modulesToExport;