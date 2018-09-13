module.exports = function(app, userRepository) {
  app.post('/user', function(req, res) {
    userRepository
      .save(req.body)
      .then(item => res.end(item))
      .catch(error => {
        console.log(error)
        res.statusCode = 400
        res.send(error)
      })
  })
}