module.exports = function(app, userRepository) {
    app.post('/user', function(req, res) {
        userRepository
            .save(req.body)
            .then(item => res.end(item))
            .catch(error => {
                console.log(error)
                if(error.code == 0)
                    res.statusCode = 400
                else if(error.code == 1)
                    res.statusCode = 409
                res.send(error)
            })
    })
}