module.exports = class UserRepository {
    constructor(db) {
        this.db = db
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.db.collection("users").find({}, {}).toArray((error, result) => {
                if(error) {
                    console.log(error.toString())
                    reject({code:0, message:"Something happened!"})
                }
                else {
                    resolve(result)
                }
            })
        })
    }

    /**
     * Guarda el usuario en la base de datos devolviendo una promesa
     * @param {User} user - Un objeto con una propiedad username y otra con propiedad password
     */
    save(user) {
        return new Promise((resolve, reject) => {
            if(user.username && user.password)
                this.db.collection("users").insertOne(user, (error, result) => {
                    if(error) 
                        reject({code: 1, message: "The user already exists"})
                    else if(result.insertedCount > 0)
                        resolve("Sucessfull registration")
                })
            else
                reject({code: 0, message: "You need to send username and password"})
        })
    }
}