const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const PORT = process.env.PORT || 5500;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require('express-flash');
const exphbs = require('express-handlebars');
const crypto = require('crypto');

const util = require("util");
const { format } = require("util");
const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");

// google-cloud/storage

const storage = new Storage({ keyFilename: "CherryPot-Admin.json" });
const bucket = storage.bucket("plastic-products");

// mongodb 
const { MongoClient, Binary } = require("mongodb");

// Replace the following with your Atlas connection string 
// encode this connection string (since the password is inside here)                                                                                                                                       
const mongo_url = "mongodb+srv://CherryPot-Admin:vNtbSNvonpXzGZbS@cherrypot.1cwz1.mongodb.net/CherryPot-Website?retryWrites=true&w=majority";

// connect the session when you need 
// if not the session will be expired 


// The database to use
const dbName = "CherryPot-Website";

var app = express();

app.use(flash());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// POST size load limit
// research here more !
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

var session_configuration = {
  secret: "User Login",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour sesison lifetime 
    secure: true
  }
};

session_configuration.cookie.secure = false;

app.use(session(session_configuration));
app.use(cookieParser('User Login'));
app.use(passport.initialize());
app.use(passport.session());

// login authentication using LocalStrategy 
var user1 = crypto.createHash("sha256");
user1.update("admin");
var user2 = crypto.createHash("sha256");
user2.update("cherrypot");

var users = {
  "id1": {
    id: 1, username: "admin", password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918" // user1.digest("hex")
  },
  "id2": {
    id: 2, username: "cherrypot", password: "8f14caf6d3eac22ba3213f6dd4801dd6b01d935258bb1b9acc730dd0fc911e5d" // user2.digest("hex")
  }
};

console.log(users.id2.password);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded());

// parse application/json
app.use(express.json());

passport.serializeUser(function (user, done) {
  if (users["id" + user.id]) {
    done(null, "id" + user.id);
  }
  else {
    done(new Error("CANT_SERIALIZE_INVALID_USER"));
  }
});

passport.deserializeUser(function (userid, done) {
  if (users[userid]) {
    done(null, users[userid]);
  }
  else {
    done(new Error("CANT_FIND_USER_TO_DESERIALIZE"));
  }
});

passport.use(new LocalStrategy(function (username, password, done) {
  setTimeout(() => {
    for (index in users) {
      if (users[index].username.toLowerCase() == username.toLowerCase()) {
        // using crypto module to check the hash value 
        var hashChecker = crypto.createHash("sha256");
        hashChecker.update(password);

        if (users[index].password == hashChecker.digest("hex")) {
          return done(null, users[index]);
        }
      }
    }
    return done(null, false, { message: "Incorrect credentials" });
  }, 1500);
}));


// serve all the html files from the static directory 
app.use(express.static(path.join(__dirname, "/static/")));

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

// routing for java files 
app.get("/js/:scripts", (req, res, next) => {
  var filename = req.params.scripts;

  res.sendFile(path.join(__dirname, "/js/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
  });
});

// routing for json data file 
app.get("/json_data", (req, res, next) => {
  async function run() {
    try {
      var client = new MongoClient(mongo_url);
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);

      const col = db.collection("PlasticProducts");

      // Find document
      const myDoc = await col.find({}).toArray();
      var response_data = { main: myDoc };

      res.json(response_data);

    } catch (err) {
      console.log(err.stack);
    }

    finally {
      await client.close();
    }
  }

  run().catch(console.dir);
})

// routing for webpage images (icons, logos) 
app.get("/img/:images", (req, res, next) => {
  var filename = req.params.images;

  res.sendFile(path.join(__dirname, "/img/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
  });
});

// admin login page 
app.get("/admin_login", (req, res, next) => {
  var flashMsg = req.flash("error")[0];
  var msg = "";
  if (req.query.status == "403") {
    msg = "Login timeout !";
  }

  if (flashMsg) {
    msg = "Login Failed : " + flashMsg;
  }

  res.render('login', {
    helpers: {
      message: function () { return msg; }
    }
  }
  );
});

// login authentication check 
app.post("/admin_login", passport.authenticate("local", {
  successRedirect: "admin/portal",
  failureRedirect: "login",
  failureFlash: true
}));

function accessCheck(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    res.redirect("/admin_login?status=403");
  }
}

// admin portal page
app.get("/admin/portal", accessCheck, (req, res, next) => {
  if (req.query.resetPassword) {
    res.status(500).send({Error : "Message From server: Currently under maintainence ... "});
    // res.redirect("/admin/portal");
    console.log("redirected");
    return;
  }

  res.render("portal", {
    helpers: {
      username: function () {
        return req.user.username;
      }
    }
  });
});

// user logout
app.get("/admin_logout", (req, res, next) => {
  req.logout();
  res.redirect("/admin_login");
});

// get all the image (as url) from the google-cloud/storage bucket
app.get("/get_files", async (req, res, next) => {
  try {
    const [files] = await bucket.getFiles();
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      });
    });
    res.status(200).json(fileInfos);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Unable to read list of files!",
    });
  }
});

// get the image as by matching the code (as url) from the google-cloud/storage bucket
app.get("/get_files/:name", async (req, res, next) => {
  try {
    const [files] = await bucket.getFiles({
      prefix: req.params.name
    });
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      });
    });
    res.status(200).json(fileInfos);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Unable to read list of files!",
    });
  }
});

// delete the files
const deleteFiles = async (req, res, next) => {
  try {
      await bucket.deleteFiles({
          prefix: req.params.name + "/",
          force: true
      });

      next(); 

  } catch (err) {
      res.status(500).send({
          message: "Could not delete the files (directory). " + err,
      });
  }
};

// upload img file to google-storage/cloud
app.post("/file_upload/:name", deleteFiles, async (req, res, next) => {
  let processFile_init = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 100 * 1024 * 1024
    }
  }).array(req.params.name);

  let processFile = util.promisify(processFile_init);
  try {
    await processFile(req, res);

    // for multiple files checking 
    if (!req.files) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    req.files.forEach((file) => {
      const blob = bucket.file(req.params.name + "/" + file.originalname);

      // create writable stram to OVERWRITE the contents of the file in your bucket 
      // file upload is happening here already
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on("error", (err) => {
        res.status(500).send({ message: err.message });
      });
      blobStream.on("finish", async (data) => {
        // Create URL for directly file access via HTTP.
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        try {
          await bucket.file(req.params.name + "/" + file.originalname).makePublic();
        } catch {
          if (!res.headersSent) {
            return res.status(500).send({
              message:
                `Uploaded the file successfully: ${file.originalname}, but public access is denied!`,
              url: publicUrl,
            });
          }

        }
      });
      blobStream.end(file.buffer);

    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 20MB!",
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${err}`,
    });
  }

  res.redirect("/admin/portal");
  // res.status(500).send({status: "successfully"});
});

// delete image files from the google-cloud/storage
app.get("/deleteFiles/:name", deleteFiles, (req, res, next)=> {
  // res.json({status : "Deleted Successful"});
  res.redirect("/admin/portal");  
});

// add the BSON document to the mongoDB
app.post("/adminAdd", function (req, res) {
  console.log("Requested for Add");

  let doc = req.body;

  async function run() {
    try {
      var client = new MongoClient(mongo_url);
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);

      const col = db.collection("PlasticProducts");

      // Insert a single document, wait for promise so we can read it back
      await col.insertOne(doc);

    } catch (err) {
      console.log(err.stack);
    }

    finally {
      await client.close();
    }
  }

  run().catch(console.dir);
});

// update the BSON document to the mongoDB
app.post("/adminUpdate", function (req, res) {
  console.log("Requested for Update");

  async function run() {
    try {
      var client = new MongoClient(mongo_url);
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);

      const col = db.collection("PlasticProducts");

      await col.replaceOne({ "code": req.body.code }, req.body.document);

    } catch (err) {
      console.log(err.stack);
    }

    finally {
      await client.close();
    }
  }

  run().catch(console.dir);
});

// delete the BSON documents from the mongoDB
app.post("/adminDelete", function (req, res) {
  console.log("Requested for Delete");

  async function run() {
    try {
      var client = new MongoClient(mongo_url);
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);

      const col = db.collection("PlasticProducts");

      // for (index in req.body.deleteList) {
      //   await col.deleteOne({ "code": { "$eq": req.body.deleteList[index] } });
      // }      
      await col.deleteMany({ "code": { "$in": [... req.body.deleteList] } });

    } catch (err) {
      console.log(err.stack);
    }

    finally {
      await client.close();
    }
  }

  run().catch(console.dir);
});

app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));