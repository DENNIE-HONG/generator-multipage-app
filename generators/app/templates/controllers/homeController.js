const homeController = async (ctx) => {
  try {
    let data = {};
    data.title = '首页';
    await ctx.render('home', data);
  } catch (err) {
    ctx.throw(err);
  }
};
module.exports = homeController;
