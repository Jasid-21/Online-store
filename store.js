//GLOBAL VARIABLES AND LIBRARIES.
const express = require('express');
const mongoose = require("mongoose");
const parser = require('body-parser');

const mimetypes = require('mime-types');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'static/database/images',
    filename: function(req, file, cb){
        cb("", Date.now() + "." + mimetypes.extension(file.mimetype))
    }
});
const upload = multer({
    storage: storage
});
const models = require('./schemas.js');

const app = express();

//CONFIGURATION.
require("dotenv").config();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(parser.urlencoded({extended:true}));
app.use(parser.json());

mongoose.connect('mongodb://127.0.0.1:27017/onlineStoreDb', function(error, db){
    if(error){
        console.log("Error trying to connect to mongo database: ", error);
    }else{
        console.log("Connection created successfully...");
    }
});

//ROUTES.
app.get("/", function(req, resp){
    resp.render("home");
});

app.get("/newArticle", function(req, resp){
    const user_id = "00001";
    resp.render('newArticle.ejs', {'STR_user_id': user_id});
});

app.post("/newArticle", upload.single('newArticle_img'), function(req, resp){
    var path = "";
    var pathArray = req.file.path.split("\\");
    for(var i=0; i<pathArray.length - 1; i++){
        path += pathArray[i] + "/";
    }
    path += pathArray[pathArray.length - 1];

    var objectToSend = new models.Article({
        user_ID: req.query.user_id,
        name: req.body.newArticle_name,
        author: req.body.newArticle_author,
        price: req.body.newArticle_price,
        amount: req.body.newArticle_amount,
        description: req.body.newArticle_desc,
        url: path
    });
    console.log("SHOWING OBJECT TO SEND:");
    console.log(objectToSend);

    objectToSend.save().then(function(){
        resp.send({"status": 1});
    }).catch(function(error){
        console.log("Error trying to save new article: ", error);
        resp.send({"status": 0, "message": "Error trying to save new article..."});
    });
});




//--------------------------------------ALL OF THIS IS FOR TESTING NEW KNOWLEDGES--------------
app.get("/test", function(req, resp){
    console.log(globalDb);
    resp.render("testing");
});

app.post("/testing", upload.single('myImage'), function(req, resp){
    const mydata = req.body;
    console.log(mydata);

    resp.send({"status": 1});
});
//-------------------------------------- HERE IS THE FINAL OF TESTING SECTION--------------

//FINAL.
app.listen(app.get('port'), function(){
    console.log("Server listening in port: ", app.get('port'));
});


//FUNCTIONS.