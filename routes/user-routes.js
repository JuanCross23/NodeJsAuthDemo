var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;

module.exports = function(app, userRepository, authenticationService) {
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

    /**
     * Método para obtener una lista de todos los usuarios
     */
    app.get('/user', async (req, res) => {
        const isAuthenticated = await authenticationService.verifyAuthorization(req)
        if(isAuthenticated) {
            userRepository
                .getAll()
                .then(items => res.send(items))
                .catch(error => {
                    console.log(error)
                    if(error.code == 0)
                        res.statusCode = 500
                    res.send(error)
                })
        } else {
            sendUnauthorized(res)
        }
    })

    /**
     * Método para editar un usuario
     */
    app.put('/user', async (req, res) => {
        const isAuthenticated = await authenticationService.verifyAuthorization(req)
        if(isAuthenticated) {

            const user = req.body;
            
            if(!hasCorrectProperties(user)) {
                res.statusCode = 400
                res.send({ code: 0, message: "Invalid model" })
                return
            }
    
            if(!idIsValid(user._id)) {
                res.statusCode = 400
                res.send({ code: 0, message: "Please provide a valid ID" })
                return
            }
    
            user._id = new ObjectId(user._id)
    
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
        } else {
            sendUnauthorized(res)
        }
    })
    
    /**
     * Método para eliminar usuarios
     */
    app.delete("/user/:ID", async (req, res) => {
        const isAuthenticated = await authenticationService.verifyAuthorization(req)
        if(isAuthenticated){
            const userId = req.params.ID; 
            if(!idIsValid(req.params.ID)) {
                res.statusCode = 400;
                res.send({code:0, message: "Please send a valid ID"})
                return
            }
    
            userRepository.delete(new ObjectId(userId))
                .then(() =>{
                    res.statusCode = 204
                    res.end()
                })
                .catch(error => {
                    console.log(error)
                    if(error.code == 2)
                        res.statusCode = 404
                    else
                        res.statusCode = 500
                    res.send(error)
                })
        } else {
            sendUnauthorized(res)
        }
    })
}

function hasCorrectProperties(user) {
    return user._id && user.username && user.password
}

function idIsValid(id) {
    return typeof id === "string" && id.length == 24
}

function sendUnauthorized(res) {
    res.statusCode = 401
    res.end()
}