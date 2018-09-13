const express = require('express')
const MongoClient = require('mongodb').MongoClient

const dbconfig = require('./config/db')

const app = express()

app.use(express.json())

MongoClient.connect(dbconfig.url, (err, database) => {
    if (err) return console.log(err)
                        
    const db = database.db("auth")
    require('./routes')(app, db)
    const port = 3920;
    app.listen(port, () => {
        console.log('We are live on ' + port);
    })
})