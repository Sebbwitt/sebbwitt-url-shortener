// Require: Express router
const express = require("express");
const router = express.Router();

// Require: Validator
const Validator = require("../common/Validator");

// Initialize: Create the Url Table 
// Will ignore it if it exists
const dbConnection = require("../db")();
var db = dbConnection.Get();
db.run("CREATE TABLE IF NOT EXISTS urlTable(mini type UNIQUE, destination)");

router.get("/", (req, res) => {
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

router.post("/insert", (req, res) => {
    const data = req.body;

    //Check if URL is a valid URL and deny the creation of "mini" : "mini" path
    if (!Validator.isValidUrl(data.destination) || data.mini === "mini") {
        res.status(400).json({
            message: "Invalid inputs - Invalid URL or restricted mini address",
            success: false
        });
        return;
    }

    const newEntry = [data.mini, data.destination];
    let insertionQuery = `INSERT INTO urlTable(mini, destination) VALUES(?,?)`;
    let statement = db.prepare(insertionQuery);

    statement.run(newEntry, err => {
        if (err) {
            res.status(400).json({
                message: err.message,
                success: false
            });
            return;
        } else {
            res.status(400).json({
                message: "Successfully added to database",
                success: true,
                data: newEntry
            });
            return;
        }
    });
});

router.get("/url/:id", (req, res) => {
    const id = req.params.id;

    db.serialize(() => {
        db.get(`SELECT mini, destination from urlTable WHERE mini=?`, id, (err, row) => {
            if (err) {
                res.status(400).json({
                    message: err.message,
                    data: null
                });
                return;
            } else if (!row) {
                res.status(400).json({
                    message: "None found",
                    data: null
                });
                return;
            } else {
                res.status(200).json({
                    message: "Found",
                    data: row
                });
                return;
            }
        });
    });
});

router.delete("/url/:id", (req, res) => {
    
    const id = req.params.id;

    // Check if this entry exist
    db.get(`SELECT mini FROM urlTable WHERE mini=?`, id, (err, row) => {

        if (err) {
            res.status(400).json({
                message: err.message,
                success: false
            });
            return;
        } else if (!row) {
            console.log(row);
            res.status(400).json({
                message: "Not found",
                success: false
            });
            return;
        } else {
            // Entry does exist
            db.run(`DELETE FROM urlTable WHERE mini=?`, id, err => {
                if (err) {
                    res.status(400).json({
                        message: err.message,
                        success: false
                    });
                    return;
                } else {
                    res.status(200).json({
                        message: `Successfully delete ${id}`,
                        success: true
                    });
                    return;
                }
            });
        }
    });
});

module.exports = router;