const homeController = require('../controllers/homeController');
function homeRoute (router) {
  router.get('/', homeController);
}
module.exports = homeRoute;