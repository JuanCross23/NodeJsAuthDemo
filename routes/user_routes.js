module.exports = function(app, userRepository) {
  app.post('/user', function(req, res) {
      res.end()
  })
}