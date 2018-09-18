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
            .then(() => sendNoContent(res))
            .catch(error => sendError(res, error))
    })
    
    /**
     * Método para eliminar usuarios
     */
    app.delete("/user/:ID", async (req, res) => {
        authenticationService.verifyAuthorization(req)
        .then(() => verifyId({_id:req.params.ID}))
        .then(user => userRepository.delete(user._id))
        .then(() => sendNoContent(res))
        .catch(error => sendError(res, error))
    })
}

function verifyProperties(user) {
    return new Promise((resolve, reject) => {
        //Verificar que ambas propiedades existan en el objeto
        if(user.username && user.password)
            resolve(user)
        else 
            reject({code: 400, message: "Invalid model"})
    })
}

function verifyId(user) {
    return new Promise((resolve, reject) => {
        if(typeof user._id === "string" && user._id.length == 24 && user._id.match("^[0-9A-Fa-f]+$")) {
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

function sendNoContent(res) {
    res.statusCode = 204
    res.end()
}