var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;

module.exports = function(app, userRepository, authenticationService) {
    /**
     * Método para crear usuarios
     */
    app.post('/user', function(req, res) {
        const user = req.body
        verifyProperties(user)
            .then(() => userRepository.insert(user))
            .then(message => res.end(message))
            .catch(error => sendError(res, error))
    })

    /**
     * Método para obtener una lista de todos los usuarios
     */
    app.get('/user', (req, res) => {
        authenticationService.verifyAuthorization(req)
            .then(() => userRepository.getAll())
            .then(items => res.send(items))
            .catch(error => sendError(res, error))
    })

    /**
     * Método para editar un usuario
     */
    app.put('/user', async (req, res) => {
        authenticationService.verifyAuthorization(req)
            .then(() => verifyProperties(req.body))
            .then(user => verifyId(user))
            .then(user => userRepository.update(user))
            .then(() => {
                res.statusCode = 204
                res.end()
            })
            .catch(error => sendError(res, error))
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
    return user.username && user.password
}

function idIsValid(id) {
    return typeof id === "string" && id.length == 24
}

function sendUnauthorized(res) {
    res.statusCode = 401
    res.end()
}

function verifyProperties(user) {
    return new Promise((resolve, reject) => {
        if(hasCorrectProperties(user))
            resolve(user)
        else 
            reject({code: 400, message: "Invalid model"})
    })
}

function verifyId(user) {
    return new Promise((resolve, reject) => {
        if(idIsValid(user._id)) {
            user._id = new ObjectId(user._id)
            resolve(user)
        }
        else 
            reject({code: 400, message: "Please provide a valid ID"})
    })
}

function sendError(res, error) {
    console.log(error)
    res.statusCode = error.code
    res.send(error.message)
}