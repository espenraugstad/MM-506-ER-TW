const fs = require("fs");

class Db {
  // Read database
  async getDatabase() {
    try {
      const data = await fs.promises.readFile("./presentations.json", "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.log("Error reading database");
      console.log(err);
    }
  }

  async writeDatabase(db) {
    try{
      fs.writeFileSync("./presentations.json", JSON.stringify(db));
      return true;
    } catch (err){
      console.log("Error writing to database");
      console.log(err);
      return false;
    }
    
  }

  async checkUser(username, password, role) {
    let db = await this.getDatabase();
    let users = db.users;
    let found = users.filter(
      (el) =>
        el.username === username && el.password === password && el.role === role
    );
    return found;
  }

  async getPresentations(id) {
    let db = await this.getDatabase();
    let presentations = db.presentations;
    let found = presentations.filter((el) => el.owner_id === id);
    return found;
  }

  async getPresentation(idtoken) {
    // Decode ids
    let [pid, uid] = Buffer.from(idtoken, "base64").toString().split(":");

    let db = await this.getDatabase();
    let presentations = db.presentations;
    let found = presentations.filter(
      (el) =>
        el.presentation_id === parseInt(pid) && el.owner_id === parseInt(uid)
    );
    return found;
  }

  async savePresentation(currentPresentation) {
    let db = await this.getDatabase();
    // Loop through presentations
    for (let presIndex in db.presentations) {
      if (
        db.presentations[presIndex].presentation_id ===
        currentPresentation.presentation_id
      ) {
        db.presentations[presIndex] = currentPresentation;
        break;
      }
    }

    // Write the new database
    console.log("Saving");
    let saved = await this.writeDatabase(db);
    return saved;
  }

  async createPresentation(user_id){
    let db = await this.getDatabase();
    //console.log(db);

    // Get the highest presentation id
    let highestId = 0;
    for(let p of db.presentations){
      if(p.presentation_id > highestId){
        highestId = p.presentation_id;
      }
    }

    let newPresentation = {
      presentation_id: highestId + 1,
      presentation_title: "Untitled presentation",
      owner_id: user_id,
      markdown: "[theme: ]",
      slides: [],
      hasAccess: []
    }

    db.presentations.push(newPresentation);

    let successfullyWritten = await this.writeDatabase(db);
    if(successfullyWritten){
      return highestId + 1;
    } else {
      return -1;
    }
  }

  async deletePresentation(presentation_id){
    let db = await this.getDatabase();
    //console.log(presentation_id);
    //console.log(db);

    db.presentations = db.presentations.filter((pres) => {
      return parseInt(pres.presentation_id) !== parseInt(presentation_id);
    });

    let written = await this.writeDatabase(db);
    return written;
  }
}

module.exports = Db;
