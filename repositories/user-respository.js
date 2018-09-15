

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

    update(user) {
        return new Promise((resolve, reject) => {
            const filter = { _id: user._id }
            
            this.db.collection("users").updateOne(
                filter, 
                { 
                    $set: {
                        username: user.username,
                        password: user.password
                    }
                }, 
                (error, result) => {
                    if(error) 
                        reject({code: 0, message:"The username is already in use"})
                    else if (result.modifiedCount > 0)
                        resolve()
                    else if(result.matchedCount == 0)
                        reject({code: 1, message: "No item matched the given ID"})
                    else 
                        reject({code: 2, message:"Don't know what happened but this shouldn´t happen"})
            })
        })
    }
}