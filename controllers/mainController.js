const controller = {}
module.exports = controller

controller.renderIndex = async (req, res) => { // eslint-disable-line
  res.render('index', { layout: 'main' })
}
