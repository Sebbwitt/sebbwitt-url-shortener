// Require: Express router
const express = require("express");
const router = express.Router();

// Initialize: Create the Url Table 
// Will ignore it if it exists
const dbConnection = require("../db")();
var db = dbConnection.Get();

db.run("CREATE TABLE IF NOT EXISTS urlTable(mini type UNIQUE, destination)");

router.get("/", (req, res) => {
    var asdasd = [];
    var count = 0;
    
    db.serialize( () => {
        db.all(`SELECT mini, destination FROM urlTable`, (err, allRows) => {
            if (err) {
                res.status(500).json({
                    message: err.message
                });
                return;
            } else {
                res.status(200).json({
                    allUrls: allRows
                });
                return;
            }
        });
    });
});

router.get("/insert", (req, res) => {
    
    let testData = [
        ["test", "https://www.google.com"],
        ["test2", "https://www.yahoo.com"],
        ["test3", "https://www.facebook.com"],
        ["a", "https://stackoverflow.com/questions/29555290/what-is-the-difference-between-res-end-and-res-send"]
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
        db.get(`SELECT mini, destination from urlTable WHERE mini="${req.params.id}";`, (err, row) => {
            if (err) {
                res.status(400).json({
                    message: err.message
                });
                return;
            } else if (!row) {
                res.status(400).json({
                    message: "None found"
                });
                return;
            } else {
                res.status(200).redirect(row.destination);
                return;
            }
        });
    });
});

router.get("/drop", (req, res) => {
    db.run("DROP TABLE IF EXISTS urlTable");
    res.json({message: "ok"});
})

module.exports = router;