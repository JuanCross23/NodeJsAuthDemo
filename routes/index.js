const authRoutes = require('./authentication-routes')
const userRoutes = require('./user-routes')

module.exports = function(app, db) {
  const userRepository = require('../repositories/user-respository')
  authRoutes(app, db)
  userRoutes(app, new userRepository(db))
}