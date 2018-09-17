module.exports = class AuthenticationService {
    constructor(db) {
        this.db = db;
    }
    verifyAuthorization(request) {
        const authorizationHeader = request.get('Authorization')
        return new Promise((resolve, reject) => {
            if(authorizationHeader && hasValidFormat(authorizationHeader)) {
                this.db.collection("sessions").findOne({ token: authorizationHeader.slice(7) }, (err, item) => {
                    if(err) reject({ code: 500, message: "There was a problem, try again later" })
                    else if(item == null) reject({ code: 401, message: "Not a valid token" })
                    else if(item.expirationDate < new Date()) reject({ code: 401, message: "Token has expired" })
                    else resolve()
                })
            }
            else 
                reject({ code: 400, message: "No authorization header or not valid " })
        })
    }
}

function hasValidFormat(authorizationHeader) {
    const regex = new RegExp("Bearer [a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}")
    return regex.test(authorizationHeader)
}