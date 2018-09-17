module.exports = class AuthenticationService {
    constructor(db) {
        this.db = db;
    }
    verifyAuthorization(request) {
        const authorizationHeader = request.get('Authorization')
        return new Promise(resolve => {
            if(authorizationHeader && hasValidFormat(authorizationHeader)) {
                this.db.collection("sessions").findOne({token: authorizationHeader.slice(7)}, (err, item) => {
                    if(err) resolve(false)
                    else if(item == null) resolve(false)
                    else if(item.expirationDate < new Date()) resolve(false)
                    else resolve(true)
                })
            }
            else 
                resolve(false)
        })
    }
}

function hasValidFormat(authorizationHeader) {
    const regex = new RegExp("Bearer [a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}")
    return regex.test(authorizationHeader)
}