const homeController = async (ctx) => {
  try {
    let data = {};
    data.title = 'home';
    await ctx.render('home.html');
  } catch (err) {
    ctx.throw(err);
  }
};
module.exports = homeController;
