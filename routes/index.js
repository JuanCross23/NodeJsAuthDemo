const authRoutes = require('./authentication_routes');

module.exports = function(app, db) {
  authRoutes(app, db);
};