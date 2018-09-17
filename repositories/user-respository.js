

module.exports = class UserRepository {
    constructor(db) {
        this.db = db
    }

    delete(id) {
        return new Promise ((resolve, reject) => {
            this.db.collection("users").deleteOne({ _id:id }, (error, commandResult) => {
                if(error || commandResult.result.ok != 1)
                    reject({ code:1, message: "The command didn't complete" })
                else if(commandResult.deletedCount != 1)
                    reject({ code:2, message: "Couldn't find the item" })
                else if(commandResult.deletedCount == 1)
                    resolve()
                else
                    reject({ code:3, message: "This shouldn't happen :(" })
            })
        })
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
    insert(user) {
        return new Promise((resolve, reject) => {
            this.db.collection("users").insertOne(user, (error, result) => {
                if(error) 
                    reject({code: 409, message: "The user already exists"})
                else if(result.insertedCount > 0)
                    resolve("Sucessfull registration")
            })
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