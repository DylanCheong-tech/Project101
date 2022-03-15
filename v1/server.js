const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5050

var app = express();

// serve all the html files from the static directory 
app.use(express.static(path.join(__dirname,"/static/")));

// routing for css stylesheet files 
app.get("/css/:stylesheet", (req, res, next) => {
  var filename = req.params.stylesheet;
  
  console.log("Requesting : " + filename);

  res.sendFile(path.join(__dirname + "/css/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
    else {
      console.log(filename + " sent successfully !");
    }
  });
});

// routing for jsvascript files 
app.get("/js/:scripts" , (req, res, next) => {
  var filename = req.params.scripts;

  console.log("Requesting : " + filename);

  res.sendFile(path.join(__dirname , "/js/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
    else {
      console.log(filename + " sent successfully !");
    }
  });
});

// routing for json data file 
app.get("/json/:data" , (req, res, next) => {
  var filename = req.params.data;
  
  console.log("Requesting : " + filename);

  res.sendFile(path.join(__dirname , "/json/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
    else {
      console.log(filename + " sent successfully !");
    }
  });
})

// routing for webpage images (icons, logos) 
app.get("/img/:images", (req, res, next) => {
  var filename = req.params.images;

  console.log("Requesting : " + filename);

  res.sendFile(path.join(__dirname , "/img/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
    else {
      console.log(filename + " sent successfully !");
    }
  });
});

// routing for product category images 
app.get("/img/:category/:subcategory/:images", (req, res, next) => {
  var category = req.params.category;
  var subcategory = req.params.subcategory;
  var filename = req.params.images;

  console.log("Requesting : " + category + "/" + filename);

  res.sendFile(path.join(__dirname , "/img/" + category + "/" + subcategory + "/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
    else {
      console.log(category + "/" + filename + " sent successfully !");
    }
  });
});

// routing for saucer product with text images sub-sub  directory
app.get("/img/:category/:subcategory/:with_text/:images", (req, res, next) => {
  var category = req.params.category;
  var subcategory = req.params.subcategory;
  var with_text = req.params.with_text;
  var filename = req.params.images;

  console.log("Requesting : " + category + "/" + filename);

  res.sendFile(path.join(__dirname , "/img/" + category + "/" + subcategory + "/" +  with_text + "/" + filename), (err) => {
    if (err) {
      res.sendStatus(404);
      next(err);
    }
    else {
      console.log(category + "/" + filename + " sent successfully !");
    }
  });
});

app.get("*", (req, res) => {
  res.redirect("/");
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));