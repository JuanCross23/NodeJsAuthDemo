/**
 * Verifica que el usuario exista y si existe, devuelve un token
 * @param {Una instancia de MongoDB} db 
 * @param {Un objeto con username y password del usuario que se quiera verificar} user 
 */
module.exports = function (db, user) {
    const createToken = require('./token-creator')
    return new Promise((resolve, reject) => {
        db.collection("users").findOne(user, (err, item) => {
            if(err) reject(err)
            else if(item == null) reject("The user doesn't exist")
            else {
                createToken(db, item._id)
                    .then(token => resolve(token))
                    .catch(onStartSessionProblem => reject(onStartSessionProblem))
            }
        });
    }) 
}