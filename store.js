//GLOBAL VARIABLES AND LIBRARIES.
const express = require('express');
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const parser = require('body-parser');

//CONFIGURATION.
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(parser.urlencoded({extended:true}));
app.use(parser.json());
/*
mongoose.connect('mongodb://127.0.0.1:27017/onlineStoreDb', function(error, db){
    if(error){
        console.log("Error trying to connect to mongo database: ", error);
    }else{
        console.log("Connection created successfully...");
        globalDb = db;
    }
});
*/

//ROUTES.
app.get("/", function(req, resp){
    resp.render("home");
});

app.get("/newArticle", function(req, resp){
    const user_id = "00001";
    resp.render('newArticle.ejs', {'STR_user_id': user_id});
});

app.post("/newArticle", function(req, resp){
    try{
        console.log(req.body);
        resp.send({"status": 1});
    }catch(error){
        console.log("Error in post receiver: ", error);
        resp.send({"status": 0});
    }
});




//--------------------------------------ALL OF THIS IS FOR TESTING NEW KNOWLEDGES--------------
app.get("/test", function(req, resp){
    resp.render("testing");
});

app.post("/testing", function(req, resp){
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