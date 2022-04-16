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
const plastic_bucket = storage.bucket("plastic-products");
const iron_bucket = storage.bucket("iron-products");

// mongodb 
const { MongoClient, Binary } = require("mongodb");

// Replace the following with your Atlas connection string 
// encode this connection string (since the password is inside here)                                                                                                                                       
const mongo_url = "mongodb+srv://CherryPot-Admin:vNtbSNvonpXzGZbS@cherrypot.1cwz1.mongodb.net/CherryPot-Website?retryWrites=true&w=majority";

// The database to use
const dbName = "CherryPot-Website";

var app = express();

app.use(flash());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// POST size load limit
// research here more !
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '5gb', extended: true }));

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

var users = {
  "id1": {
    id: 1, username: "admin", password: "186cf774c97b60a1c106ef718d10970a6a06e06bef89553d9ae65d938a886eae"
  },
  "id2": {
    id: 2, username: "cherrypot", password: "49feae8c5bb76314d74850572526ea7318481f5000a77e9e3a36e4bdf6511ee1" 
  }
};

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

// routing for plastic json data file 
app.get("/plastic_json_data", (req, res, next) => {
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

// routing for iron json data file 
app.get("/iron_json_data", (req, res, next) => {
  async function run() {
    try {
      var client = new MongoClient(mongo_url);
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);

      const col = db.collection("IronProducts");

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
  successRedirect: "admin/portal?cat=plastic",
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

  let category = req.query.cat;
  let page = category == "plastic" ? "plastic-portal" : "iron-portal";

  res.render(page, {
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

// get all the plastic image (as url) from the google-cloud/storage bucket
app.get("/get_plastic_files", async (req, res, next) => {
  try {
    const [files] = await plastic_bucket.getFiles();
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

// get all the iron image (as url) from the google-cloud/storage bucket
app.get("/get_iron_files", async (req, res, next) => {
  try {
    const [files] = await iron_bucket.getFiles();
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

// get the plastic image as by matching the code (as url) from the google-cloud/storage bucket
app.get("/get_plastic_files/:name", async (req, res, next) => {
  try {
    const [files] = await plastic_bucket.getFiles({
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

// get the iron image as by matching the code (as url) from the google-cloud/storage bucket
app.get("/get_iron_files/:name", async (req, res, next) => {
  try {
    const [files] = await iron_bucket.getFiles({
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

// delete the plastic files
const deleteFiles_plastic = async (req, res, next) => {
  try {
      await plastic_bucket.deleteFiles({
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

// delete the iron files
const deleteFiles_iron = async (req, res, next) => {
  try {
      await iron_bucket.deleteFiles({
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

// upload plastic img file to google-storage/cloud
app.post("/plastic_file_upload/:name", deleteFiles_plastic, async (req, res, next) => {
  let processFile_init = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      files: 100,
      fileSize: 100 * 1024 * 1024 * 1024
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
      const blob = plastic_bucket.file(req.params.name + "/" + file.originalname);

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
          `https://storage.googleapis.com/${plastic_bucket.name}/${blob.name}`
        );
        try {
          await plastic_bucket.file(req.params.name + "/" + file.originalname).makePublic();
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

  setTimeout(() => {
    res.redirect("/admin/portal?cat=plastic");
  }, 3000);

  // res.redirect("/admin/portal");
  // res.status(500).send({status: "successfully"});
});

// upload iron img file to google-storage/cloud
app.post("/iron_file_upload/:name", deleteFiles_iron, async (req, res, next) => {
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
      const blob = iron_bucket.file(req.params.name + "/" + file.originalname);

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
          `https://storage.googleapis.com/${iron_bucket.name}/${blob.name}`
        );
        try {
          await iron_bucket.file(req.params.name + "/" + file.originalname).makePublic();
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

  setTimeout(() => {
    res.redirect("/admin/portal?cat=iron");
  }, 3000);

  // res.redirect("/admin/portal");
  // res.status(500).send({status: "successfully"});
});

// delete plastic image files from the google-cloud/storage
app.get("/deletePlasticFiles/:name", deleteFiles_plastic, (req, res, next)=> {
  // res.json({status : "Deleted Successful"});
  // res.redirect("/admin/portal"); 
  
  setTimeout(() => {
    res.redirect("/admin/portal?cat=plastic");
  }, 3000);
});

// delete iron image files from the google-cloud/storage
app.get("/deleteIronFiles/:name", deleteFiles_iron, (req, res, next)=> {
  // res.json({status : "Deleted Successful"});
  // res.redirect("/admin/portal");  

  setTimeout(() => {
    res.redirect("/admin/portal?cat=iron");
  }, 3000);
});

// add the plastic BSON document to the mongoDB
app.post("/adminAddPlastic", function (req, res) {
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

// add the iron BSON document to the mongoDB
app.post("/adminAddIron", function (req, res) {
  console.log("Requested for Add");

  let doc = req.body;

  async function run() {
    try {
      var client = new MongoClient(mongo_url);
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);

      const col = db.collection("IronProducts");

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

// update the plastic BSON document to the mongoDB
app.post("/adminUpdatePlastic", function (req, res) {
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

// update the iron BSON document to the mongoDB
app.post("/adminUpdateIron", function (req, res) {
  console.log("Requested for Update");

  async function run() {
    try {
      var client = new MongoClient(mongo_url);
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);

      const col = db.collection("IronProducts");

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

// delete the plastic BSON documents from the mongoDB
app.post("/adminDeletePlastic", function (req, res) {
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

// delete the iron BSON documents from the mongoDB
app.post("/adminDeleteIron", function (req, res) {
  console.log("Requested for Delete");

  async function run() {
    try {
      var client = new MongoClient(mongo_url);
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);

      const col = db.collection("IronProducts");

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