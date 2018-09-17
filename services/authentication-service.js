module.exports = class AuthenticationService {
    verifyAuthorization(request) {
        const authorizationHeader = request.get('Authorization')
        return new Promise(resolve => {
            if(authorizationHeader)
                resolve(true)
            else 
                resolve(false)
        })
    }
}