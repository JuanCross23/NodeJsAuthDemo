module.exports = function(app, userRepository) {
    /**
     * Método para crear usuarios
     */
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

    app.get('/user', (req, res) => {
        userRepository
            .getAll()
            .then(items => res.send(items))
            .catch(error => {
                console.log(error)
                if(error.code == 0)
                    res.statusCode = 500
                res.send(error)
            })
    })

    app.put('/user', (req, res) => {
        userRepository
            .update(req.body)
            .then(() => {
                res.statusCode = 204
                res.end()
            })
            .catch(error => {
                console.log(error)
                if(error.code == 0)
                    res.statusCode = 409
                else if(error.code == 1)
                    res.statusCode = 404
                res.send(error)
            })
    })
}