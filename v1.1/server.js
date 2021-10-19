const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const PORT = process.env.PORT || 5000;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require('express-flash');
const exphbs  = require('express-handlebars');

var app = express();

app.use(flash());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var session_configuration = {
	secret : "User Login",
	resave : false,
	saveUninitialized: true,
	cookie : {secure : true}
};

session_configuration.cookie.secure = false;

app.use(session(session_configuration));
app.use(cookieParser('User Login'));
app.use(passport.initialize());
app.use(passport.session());

// login authentication using LocalStrategy 
var users = {
  "id1" : {
  id : 1, username: "admin", password: "admin"
},
"id2":{
  id : 2, username: "cherrypot", password: "cherrypot"
}};

// parse application/x-www-form-urlencoded
app.use(express.urlencoded());

// parse application/json
app.use(express.json());

passport.serializeUser(function (user, done) {
  if (users["id" + user.id])
	{
		done(null, "id" + user.id);
	}
	else {
		done(new Error ("CANT_SERIALIZE_INVALID_USER"));
	}
});

passport.deserializeUser(function (userid, done){
  if (users[userid])
	{
		done(null, users[userid]);
	}
	else {
		done (new Error ("CANT_FIND_USER_TO_DESERIALIZE"));
	}
});

passport.use(new LocalStrategy(function (username, password, done) {
  setTimeout( () => {
    for (index in users){
      if (users[index].username.toLowerCase() == username.toLowerCase()){
        if (users[index].password == password){
          return done(null, users[index]);
        }
      }
    }
    return done(null, false, {message: "Incorrect credentials"});
  }, 1500);
}));


// serve all the html files from the static directory 
app.use(express.static(path.join(__dirname,"/static/")));

// routing for css stylesheet files 
app.get("/css/:stylesheet", (req, res, next) => {
  var filename = req.params.stylesheet;

  res.sendFile(path.join(__dirname + "/css/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
  });
});

// routing for jsvascript files 
app.get("/js/:scripts" , (req, res, next) => {
  var filename = req.params.scripts;

  res.sendFile(path.join(__dirname , "/js/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
  });
});

// routing for json data file 
app.get("/json/:data" , (req, res, next) => {
  var filename = req.params.data;

  res.sendFile(path.join(__dirname , "/json/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
  });
})

// routing for webpage images (icons, logos) 
app.get("/img/:images", (req, res, next) => {
  var filename = req.params.images;

  res.sendFile(path.join(__dirname , "/img/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
  });
});

// routing for product category images 
app.get("/img/:category/:subcategory/:images", (req, res, next) => {
  var category = req.params.category;
  var subcategory = req.params.subcategory;
  var filename = req.params.images;

  res.sendFile(path.join(__dirname , "/img/" + category + "/" + subcategory + "/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
  });
});

// routing for saucer product with text images sub-sub  directory
app.get("/img/:category/:subcategory/:with_text/:images", (req, res, next) => {
  var category = req.params.category;
  var subcategory = req.params.subcategory;
  var with_text = req.params.with_text;
  var filename = req.params.images;

  res.sendFile(path.join(__dirname , "/img/" + category + "/" + subcategory + "/" +  with_text + "/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
  });
});

app.get("/login", (req, res, next) => {
  var flashMsg = req.flash("error")[0];
  if (flashMsg){
    console.log(flashMsg);
    res.render('loginfail' , { helpers : {
      message : function () {return "Login Failed : " + flashMsg;}
    } }
    );
  }
  else {
    res.render('loginfail');
  }
});

app.post("/login" , passport.authenticate("local", {
  successRedirect: "admin/portal",
  failureRedirect: "login",
  failureFlash: true
}));

function accessCheck (req, res, next){
  if (req.isAuthenticated()){
    next();
  }
  else{
    res.redirect("/login");
  }
}

app.get("/admin/portal" , accessCheck, (req, res, next) => {
  res.render("loginsuccess" , {
    helpers: {
      username : function () {
        return req.user.username;
      }
    }
  });
});

app.get("/logout", (req, res, next) => {
  req.logout();
    res.redirect("/login");
});

app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));