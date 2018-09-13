const authRoutes = require('./authentication_routes')
const userRoutes = require('./user_routes')

module.exports = function(app, db) {
  authRoutes(app, db)
  userRoutes(app, db)
}