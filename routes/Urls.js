// Require: Express router
const express = require("express");
const router = express.Router();

// Initialize: Create the Url Table 
// Will ignore it if it exists
const dbConnection = require("../db")();
var db = dbConnection.Get();

db.run("CREATE TABLE IF NOT EXISTS urlTable(mini type UNIQUE, destination)");
router.get("/", (req, res) => {
    res.json({
        message: "ok"
    })

    

});

router.get("/insert", (req, res) => {
    
    let testData = [
        ["test", "https://www.google.com"],
        ["test2", "https://www.yahoo.com"],
        ["test2", "https://www.facebook.com"]
    ]
    let insertionQuery = `INSERT INTO urlTable(mini, destination) VALUES(?,?)`;
    let statement = db.prepare(insertionQuery);

    for (let i = 0; i < testData.length; i++) {
        statement.run(testData[i], err => {
            if (err) console.log(err);
            console.log("inserted");
        });
    }

    res.json({message: "ok"});
});

router.get("/each/:id", (req, res) => {
    db.serialize(() => {
        db.each(`SELECT mini, destination from urlTable`, (err, row) => {
            if (err) console.log(err.message);
            console.log(row.mini + "\t" + row.destination);
            console.log(row);
        })
    });
    res.json({message: "ok"});
});

router.get("/drop", (req, res) => {
    db.run("DROP TABLE IF EXISTS urlTable");
    res.json({message: "ok"});
})

module.exports = router;