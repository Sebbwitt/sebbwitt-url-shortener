// Require: SQLite3 package
const sqlite3 = require("sqlite3").verbose();

var DBConnection = () => {

    
    var db = null;

    // Create a single entry point to database
    var DBConnect = () => {
        
        const dbNamePath = process.env.DB_NAME_PATH || "./database/urls.db";

        db = new sqlite3.Database("./database/urls.db", err => {
            if (err) return console.log(`DATABASE ERROR: ${err.message}`);
            console.log(`DATABASE CONNECTED: ${dbNamePath}`);
            if (db !== null) db.run("CREATE TABLE IF NOT EXISTS urlTable(UNIQUE(mini), destination)", () => console.log("Created new DB"));
        });
    }

    var Get = () => {
        if (db !== null) {
            console.log("DB is still alive");
        } else {
            DBConnect();
            console.log("Retrieving new db connection");
        }
        return db;
    }

    return {Get};

}

module.exports = DBConnection;