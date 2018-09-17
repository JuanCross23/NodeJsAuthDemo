module.exports = class AuthenticationService {
    verifyAuthorization(request) {
        const authorizationHeader = request.get('Authorization')
        console.log(authorizationHeader)
        
        return new Promise(resolve => {
            if(authorizationHeader && hasValidFormat(authorizationHeader))
                resolve(true)
            else 
                resolve(false)
        })
    }
}

function hasValidFormat(authorizationHeader) {
    const regex = new RegExp("Bearer [a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}")
    return regex.test(authorizationHeader)
}