/**
 * Genera un token y una fecha de expiración, lo guarda en la base de datos y finalmente lo devuelve si no ocurre ningún error
 * @param {Una instancia de MongoDB} db 
 * @param {El id del usuario del que se quiera generar un token} userId 
 */
module.exports = function (db, userId) {
        const uuidv4 = require('uuid/v4')
        const token = uuidv4()
        const expirationDate = new Date()
        // Calcula la fecha de expiración del token, agregando un mes a la fecha actual
        expirationDate.setMonth(expirationDate.getMonth() + 1)

        return new Promise((resolve, reject) => {
            db.collection("sessions").updateOne(
                { _id: userId },
                {
                    $set: {
                         token, expirationDate 
                    }
                },
                { upsert: true },
                (error, result) => {
                    if(error) reject(error.toString())
                    else if(result.result.ok != 1) reject("No se pudo insertar")
                    else resolve(token)
                }
            )
        });
}
