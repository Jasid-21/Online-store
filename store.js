//GLOBAL VARIABLES AND LIBRARIES.
const express = require('express');
const express_session = require('express-session');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

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
const initialPostsNum = 4;

const app = express();

//CONFIGURATION.
require("dotenv").config();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(cookieParser());
app.use(express_session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true
}));

const db_url = process.env.DB_URL;
mongoose.connect(db_url, function(error, db){
    if(error){
        console.log("Error trying to connect to mongo database: ", error);
    }else{
        console.log("Connection created successfully...");
    }
});


//ROUTES.
app.get("/login", function(req, resp){
    resp.render("login");
});

app.post("/login", upload.single(""), function(req, resp){
    const username = req.body.username;
    const password = req.body.password;

    getUserByName(username, false).then(function(response){
        if(response){
            if(password == response.password){
                console.log("Authenticating...");
                const sessionId = createToken(30);
                const username = response.username;
                const user_id = response.id;
                const sessionObject = new models.Session({
                    session_id: sessionId,
                    user_id: response.id,
                    username: response.username
                });

                sessionObject.save().then(function(){
                    console.log("New session saved...");
                    resp.send({
                        status: 1,
                        username: username,
                        cookieName: "session_cookie",
                        cookieValue: sessionId,
                        cookieTime: new Date(2025, 0, 1).toUTCString(),
                        user_id: user_id
                    });
                }).catch(function(error){
                    console.log("Error trying to save session object: ", error);
                    resp.send({status: 0, message: "Error trying to save new session object..."});
                })
            }else{
                console.log("User or password doesn't match.");
                resp.send({status: 0, message: "Incorrect user or password."});
            }
        }else{
            resp.send({status: 0, message: "Username not found..."});
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
                        session_id: req.session.id,
                        user_id: user.id,
                        username: username
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
    const session = req.cookies.session_cookie;
    if(session){
        models.Session.deleteOne({
            session_id: session
        }, function(error){
            if(error){
                console.log("Error removing session: ", error);
                resp.send({status: 0, message: "Error removing session..."});
            }else{
                console.log("Session removed successfully...");
                resp.send({status: 1});
            }
        });
    }else{
        console.log("Missing session object to find...");
        resp.send({status: 0, message: "Missing session object to find..."});
    }
});

app.get("/", validateSession, function(req, resp){
    const session_id = req.cookies.session_cookie;
    if(session_id){
        models.Session.findOne({session_id: session_id}, function(error, data){
            if(error){
                console.log("Error trying to get data for the session: ", error);
                resp.send({status: 0, message: "Error trying to get data for this session..."});
            }else{
                const userId = data.user_id;
                getHomeArticles(userId).then(function(response){
                    console.log("Showing response:");
                    console.log(response);
                    resp.render("home", {homeArticles: response});
                }).catch(function(error){
                    console.log(error);
                    resp.render("home", {errorMessage: "Error trying to get inital home articles  :("});
                });
            }
        });
    }else{
        console.log("Redirecting...");
        resp.redirect("/login");
    }
});

app.post("/searchArticle", [validateSession, upload.single("")], function(req, resp){
    const body = req.body;
    console.log(body);

    searchArticleBy(body.byUser, body.byName, null).then(function(response){
        if(response){
            console.log(response);
            resp.send({status: 1, data: response});
        }else{
            resp.send({status: 0, message: "Article not found..."});
        }
    }).catch(function(error){
        console.log(error);
        resp.send({status: 0, message: "Erro trying to get articles..."});
    });
});

async function searchArticleBy(user, name, price){
    var byUser = new Array();
    var byName = new Array();
    var byPrice = new Array();
    var total = new Array();
    var temp = new Array();

    if(user){
        byUser = await models.Article.find({author: {'$regex': new RegExp(user, "i")}});
        total = byUser;
    }

    if(name){
        byName = await models.Article.find({name: {'$regex': new RegExp(name, "i")}});
        if(byName && total){
            for(var nameItem of byName){
                for(var totalItem of total){
                    if(nameItem.id == totalItem.id){
                        temp.push(nameItem);
                    }
                }
            }
            total = temp;
        }else{
            total = byName;
        }
    }

    return total;
}

app.get("/newArticle", validateSession, function(req, resp){
    resp.render("newArticle");
});

app.post("/newArticle", [validateSession, upload.single('newArticle_img')], function(req, resp){
    var path = "";
    var pathArray = req.file.path.split("\\");
    for(var i=1; i<pathArray.length - 1; i++){
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

app.get("/moreInfo", validateSession, function(req, resp){
    const item_id = req.query.article_id;

    models.Article.findById(item_id, function(error, data){
        if(error){
            console.log(error);
            resp.send({status: 0, message: error});
        }else{
            console.log(data);
            resp.send({status: 1, article_info: data});
        }
    });
});

app.get("/mycart", validateSession, function(req, resp){
    const user_id = req.id;
    getCartItems(user_id).then(function(data){
        console.log(data);
        resp.render("mycart", {mycart: data});
    }).catch(function(error){
        console.log(error);
        resp.render("mycart", {errorMessage: "Error trying to get your cart items. Please, try later..."});
    });
});

app.delete("/mycart", validateSession, function(req, resp){
    const article_id = req.query.article_id;
    const user_id = req.id;
    console.log(article_id);
    console.log(user_id);

    models.Cart.deleteOne({user_id: user_id, article_id: article_id}, function(error){
        if(error){
            console.log(error);
            resp.send({status: 0, message: "Error trygin to remove this item from your cart..."});
        }else{
            console.log("Remove cart item: Done!");
            resp.send({status: 1});
        }
    });
});

app.post("/mycart", validateSession, function(req, resp){
    const user_id = req.id;
    const article_id = req.query.article_id;
    try{
        const toCart = new models.Cart({
            user_id: user_id,
            article_id: article_id
        });

        toCart.save().then(function(){
            console.log("Article added to cart!");
            resp.send({status: 1});
        }).catch(function(error){
            console.log(error);
            resp.send({status: 0, message: "Error trying to add article to cart..."});
        });
    }catch(error){
        console.log(error);
        resp.send({status: 0, message: "Error trying to add article to cart..."});
    }
});

app.post("/payCart", [validateSession, upload.single("")], function(req, resp){
    const user_id = req.id;
    const pay_information = req.body;
    console.log(pay_information);

    var cont = 0;
    if(pay_information.card_number == process.env.CARD_NUMBER){
        cont++;
    }
    if(pay_information.expiration_date == process.env.CARD_EXPIRATION){
        cont++;
    }
    if(pay_information.cvc_number == process.env.CARD_CVC){
        cont++;
    }

    if(cont === 3){
        models.Cart.deleteMany({user_id: user_id}, function(error){
            if(error){
                console.log(error);
                resp.send({status: 0, message: "Error trying to pay your products..."});
            }else{
                console.log("Payment applyed!");

                resp.send({status: 1});
            }
        });
    }else{
        resp.send({status: 0, message: "Information doesn't match..."});
    }
});


//FINAL.
app.listen(app.get('port'), function(){
    console.log("Server listening in port: ", app.get('port'));
});


//FUNCTIONS.
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

async function validateSession(req, resp, next){
    try{
        const data = await models.Session.findOne({session_id: req.cookies.session_cookie});

        if(data){
            req.id = data.user_id;
            next();
        }else{
            resp.redirect("/login");
        }
    }catch(error){
        console.log("Error verifying session: ", error);
        resp.redirect("/login");
    }
}

async function getHomeArticles(user_id){
    const friends = await models.Friend.find({user1: user_id});
    console.log(friends);
    var friends_items = new Array();

    if(friends){
        for(var friend of friends){
            const items = await models.Article.find({user_ID: friend.user2});
            for(var item of items){
                friends_items.push(item);
            }
        }
    }

    var items = await models.Article.find().limit(initialPostsNum - friends_items.length);
    for(var item of items){
        friends_items.push(item);
    }

    return friends_items;
}

async function getCartItems(user_id){
    var articles = new Array();
    const articleIds = await models.Cart.find({user_id: user_id});

    for(var id of articleIds){
        const article = await models.Article.findById(id.article_id);
        articles.push(article);
    }

    return articles;
}