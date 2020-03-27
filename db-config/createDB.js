const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const datetime = require('node-datetime');
const url = require('./db-config.js').url;

/**
 * Creating the database
 */
MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    console.log('Database created!');
    db.close();
});

/**
 * Creating the collection: clientData
 */
MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbo = db.db("tcpserver");
    dbo.createCollection("clientdata", (err, res) => {
        if (err) throw err;
        console.log("Collection: clientdata created!");
        db.close();
    });
});

/**
 * Creating Schema
 */
let TCPSchema = mongoose.Schema({
    guid: {
        type: String,
        required: true
    },
    datetime: {
        type: datetime,
        required: true
    }
},
{ collection: 'clientdata' });

let TCPModel = mongoose.model('TCPModel', TCPSchema);
module.exports = {TCPModel: TCPModel};