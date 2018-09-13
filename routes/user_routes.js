module.exports = function(app, db) {
  app.get('/user', function(req, res) {
    res.end("You're requiring a user")
  })
}