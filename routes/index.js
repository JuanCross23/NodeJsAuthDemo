const authRoutes = require('./authentication_routes')
const userRoutes = require('./user_routes')

module.exports = function(app, db) {
  const userRepository = require('../repositories/user-respository')
  authRoutes(app, db)
  userRoutes(app, new userRepository(db))
}