const NextRoutes = require('next-routes');
const routes = NextRoutes();

routes
  .add('/campaigns/new', '/campaigns/new')
  .add('/campaigns/:address', '/campaigns/show');

module.exports = routes;
