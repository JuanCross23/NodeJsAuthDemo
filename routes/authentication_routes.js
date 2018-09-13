const authenticate = require('../modules/authenticate')
module.exports = function(app, db) {
  app.post('/authentication', function(req, res) {
    authenticate(db,req.body)
        .then(token => res.send(token))
        .catch(error => {
            res.statusCode = 404
            res.send(error.toString())
        })
  })
}