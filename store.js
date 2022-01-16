//GLOBAL VARIABLES AND LIBRARIES.
const express = require('express');
const mongoose = require("mongoose");

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

mongoose.connect('mongodb://127.0.0.1:27017/onlineStoreDb', function(error, db){
    if(error){
        console.log("Error trying to connect to mongo database: ", error);
    }else{
        console.log("Connection created successfully...");
    }
});

//ROUTES.
app.get("/login", function(req, resp){
    const verifying = req.query.verifying;
    if(!verifying){
        resp.render("login");
    }else{
        const receivedSession = req.query.session;
        validateSession(receivedSession).then(function(response){
            if(response == true){
                console.log("Session validated!");
                resp.send({status: 1});
            }else{
                console.log("Session not found...");
                resp.send({status: 0, message: "Session not found..."});
            }
        }).catch(function(error){
            console.log("Error validating session in /login: ", error);
        });
    }
});

app.post("/login", upload.single(""), function(req, resp){
    const username = req.body.username;
    const password = req.body.password;

    getUserByName(username, false).then(function(response){
        if(response){
            if(password == response.password){
                console.log("Authenticating...");

                const sessionObject = new models.Session({
                    user_id: response.id,
                    nav_id: `${createToken(5)}-${createToken(5)}-${createToken(5)}-${createToken(5)}`,
                    username: response.username,
                    session_token: createToken(30)
                });

                sessionObject.save().then(function(){
                    console.log("New session saved...");
                    resp.send({status: 1, sessionObject: sessionObject});
                }).catch(function(error){
                    console.log("Error trying to save session object: ", error);
                    resp.send({status: 0, message: "Error trying to save new session object..."});
                })
            }else{
                console.log("User or password doesn't match.");
                resp.send({status: 0, message: "Incorrect user or password."});
            }
        }
    }).catch(function(error){
        console.log("Error trying to login: ", error);
        resp.send({status: 0, message: "Error trying to login..."});
    });
});

app.get("/signup", function(req, resp){
    resp.render("signup");
});

app.post("/signup", upload.single(""), function(req, resp){
    const username = req.body.username;
    const password1 = req.body.password;
    const password2 = req.body.confirm;

    if(password1 == password2){
        getUserByName(username, true).then(function(response){
            if(response == true){
                console.log("User found...");
                resp.send({"status": 0, "message": "This user alredy exist..."});
            }else{
                console.log("User doesn't exist!");
                const objectToSend = new models.User({
                    username: username,
                    password: password1
                });
                objectToSend.save().then(function(user){
                    const firstSession = new models.Session({
                        user_id: user.id,
                        username: username,
                        nav_id: `${createToken(5)}-${createToken(5)}-${createToken(5)}-${createToken(5)}`,
                        session_token: createToken(30)
                    });

                    firstSession.save().then(function(){
                        console.log("Session saved successfully...");
                        resp.send({status: 1, session: firstSession});
                    }).catch(function(error){
                        console.log("Error savein the first session: ", error);
                        resp.send({status: 0, message: "Error saving the first session..."});
                    });
                }).catch(function(error){
                    console.log("Error trying to save the new User: ", error);
                    resp.send({status: 0, message: "Error trying to save new user..."});
                });
            }
        }).catch(function(error){
            console.log("Error geting user: ", error);
        });
    }else{
        console.log("Passwords doesn't match...");
        resp.send({status: 0, message: "Passwords doesn't match..."});
    }
});

app.get("/logout", function(req, resp){
    const session = req.query.session;
    if(session){
        models.Session.findOne({
            nav_id: session.sav_id,
            session_token: session.session_token
        }, function(error, data){
            if(!error){
                models.Session.deleteOne({
                    nav_id: session.sav_id,
                    session_token: session.session_token
                }, function(error2){
                    if(error2){
                        console.log("Error removing session: ", error);
                        resp.send({status: 0, message: "Error removing session..."});
                    }else{
                        console.log("Session removed successfully...");
                        resp.send({status: 1});
                    }
                });
            }else{
                console.log("Error finding required session: ", error);
                resp.send({status: 0, message: "Error finding required session..."});
            }
        });
    }else{
        console.log("Missing session object to find...");
        resp.send({status: 0, message: "Missing session object to find..."});
    }
});

app.get("/", function(req, resp){
    const verifying = req.query.verifying;
    if(!verifying){
        resp.render("home");
    }else{
        const receivedSession = req.query.session;
        validateSession(receivedSession).then(function(response){
            if(response == true){
                resp.send({"status": 1});
            }else{
                resp.send({"status": 2});
            }
        }).catch(function(error){
            console.log("Error validating session: ", error);
            resp.send({"status": 0, "message": "An error has occured verifying the session."});
        });
    }
});

app.get("/newArticle", function(req, resp){
    const verifying = req.query.verifying;
    if(!verifying){
        resp.render("newArticle");
    }else{
        const receivedSession = req.query.session;
        validateSession(receivedSession).then(function(response){
            if(response == true){
                resp.send({"status": 1});
            }else{
                resp.send({"status": 2});
            }
        }).catch(function(error){
            console.log("Error verifying session in new Article: ", error);
            resp.send({"status": 0});
        });
    }
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

    objectToSend.save().then(function(){
        resp.send({"status": 1});
    }).catch(function(error){
        console.log("Error trying to save new article: ", error);
        resp.send({"status": 0, "message": "Error trying to save new article..."});
    });
});




//--------------------------------------ALL OF THIS IS FOR TESTING NEW KNOWLEDGES--------------
app.get("/test", function(req, resp){
    const requesting = req.query.requesting;
    if(!requesting){
        resp.render("testing");
    }else{
        resp.send(sessionObject);
    }
});
//-------------------------------------- HERE IS THE FINAL OF TESTING SECTION--------------

//FINAL.
app.listen(app.get('port'), function(){
    console.log("Server listening in port: ", app.get('port'));
});


//FUNCTIONS.
async function validateSession(object){
    object = JSON.parse(object);
    if(object){
        const data = await models.Session.findOne({
            user_id: object.user_id,
            nav_id: object.nav_id,
            session_token: object.session_token
        });
    
        if(data){
            console.log("Session found...");
            return true;
        }else{
            console.log("Session not found...");
            return false;
        }
    }else{
        console.log("Missing session object to compare...");
        return false;
    }
}

async function getUserByName(value, boolean){
    const response = await models.User.findOne({username: value});
    if(boolean == true){
        if(response){
            return true;
        }else{
            return false;
        }
    }else{
        return response;
    }
}

function createToken(max){
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const chars = upper + lower + numbers;

    var token = "";
    for(var i=0; i<max; i++){
        token += chars[Math.floor(Math.random()*(chars.length - 1))];
    }

    return token;
}