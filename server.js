const express = require("express");
const Storage = require("./modules/db.js");
const server = express();
const PORT = 8000;

server.use(express.json());
server.use(express.static("public"));

const db = new Storage();

/*** MIDDLEWARE ***/
async function checkUser(req, res, next) {
  let user, pass, role;
  if (JSON.stringify(req.body) !== "{}") {
    user = req.body.username;
    pass = req.body.password;
    role = req.body.role;
  } else {
    let token = req.headers.authorization.split(" ")[1];
    [user, pass, role] = Buffer.from(token, "base64")
      .toString("utf-8")
      .split(":");
  }

  let userFound = await db.checkUser(user, pass, role);
  if (userFound.length > 0) {
    if (userFound.length > 1) {
      console.log("Database error, duplicates found!");
      console.log(userFound);
      req.exists = true;
      req.duplicate = true;
    } else {
      req.exists = true;
      req.duplicate = false;
      req.user_id = userFound[0].user_id;
    }
  } else {
    console.log("User not found");
    req.exists = false;
    req.duplicate = false;
  }

  next();
}

server.post("/login", checkUser, async (req, res, next) => {
  if (req.exists && req.duplicate) {
    res.status(500).end();
  } else if (req.exists && !req.duplicate) {
    res.status(200).json({ id: req.user_id }).end();
  } else {
    res.status(403).end();
  }
});

server.get("/getPresentations", checkUser, async (req, res) => {
  if (req.exists) {
    let presentations = await db.getPresentations(req.user_id);
    res.status(200).json(presentations).end();

  } else {
    res.status(500).end();
  }
});

server.get("/getPresentation/:idtoken", checkUser, async (req, res) =>{
  if(req.exists){
    let presentation = await db.getPresentation(req.params.idtoken);
    if(presentation.length === 1){
      res.status(200).json(presentation[0]).end();
    } else if (presentation.length > 1){
      res.status(500).json({message: "Duplicates found!"}).end();
    } else {
      res.status(404).json({message: "No presentations found"}).end();
    }
  } else {''
    res.status(403).json({message: "Invalid user"}).end();
  }
});

server.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
