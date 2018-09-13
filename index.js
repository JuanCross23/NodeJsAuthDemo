const express = require('express')
const MongoClient = require('mongodb').MongoClient
const authenticate = require('./modules/authenticate')
const dbconfig = require('./config/db')

const app = express()

app.use(express.json())

MongoClient.connect(dbconfig.url, (err, database) => {
    if (err) return console.log(err)
                        
    const db = database.db("auth")
    app.post('/authentication', function(req, res) {
        authenticate(db,req.body)
            .then(token => res.send(token))
            .catch(error => {
                res.statusCode = 404
                res.send(error.toString())
            })
    })
    const port = 3920;
    app.listen(port, () => {
        console.log('We are live on ' + port);
    })
})