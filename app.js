// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = require('./connection');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({message: 'Hello World!'});
})

app.get("/bookmarks/:id", (req, res) => {
  
  connection.query(
    "SELECT * FROM bookmark WHERE id=?",
    [req.params.id], 
    (err, results) => {
      if(err) {
        console.log(err);
        res.status(500).send("error");
      } else if (results.length === 0) {
        return res.status(404).json({"error": 'Bookmark not found'})
      } else {
        res.status(200).json(results[0]);
      }
    }
  );
})

app.post("/bookmarks", (req,res) => {
  const {url, title} = req.body;
  if(!url || !title) {
    return res.status(422).json({"error": "required field(s) missing"});
  }
  connection.query(
    "INSERT INTO bookmark(url, title) VALUES(?, ?)",
    [url, title],
    (err, results) => {
      if(err) {
        console.log(err);
        res.status(500).send('Error saving a bookmark');
      }
    }
  );

  connection.query(
    "SELECT * FROM bookmark WHERE id=1", 
    (err, records) => {
      if(err) {
        console.log(err);
        res.status(500).send('Error saving a bookmark');
      }
      else {
        res.status(201).json(records[0]);
      }
    }
  )
});

module.exports = app;
