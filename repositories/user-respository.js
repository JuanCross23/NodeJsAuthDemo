module.exports = class UserRepository {
    constructor(db) {
        this.db = db
    }

    /**
     * Guarda el usuario en la base de datos devolviendo una promesa
     * @param {User} user - Un objeto con una propiedad username y otra con propiedad password
     */
    save(user) {
        return new Promise((resolve, reject) => {
            if(user.username && user.password)
                resolve("Okay")
            else
                reject({error: 0, message: "You need to send username and password"})
        })
    }
}