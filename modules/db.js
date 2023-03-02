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
    let found = presentations.filter((el) => el.presentation_id === parseInt(pid) && el.owner_id === parseInt(uid));
    return found;
  }
}

module.exports = Db;
