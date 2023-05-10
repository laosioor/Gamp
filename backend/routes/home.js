const router = require('./router');
const auth = require("../middlewares/auth");
const config = require('../modules/config');
const posts = require('../modules/posts');
const resenhas = require('../modules/resenhas');

module.exports = ( function() {
	router.get('/home', auth.verifyJWT, async function(req, res) {
		try {
			var usuario = await config.dbReturnUsername(req.userID);
		} catch {
			res.redirect('/sair');

			return router;
		}
		listaPosts = (await posts.pegaPosts());
		listaResenhas = (await resenhas.pegaResenhas());

		listaPubli = {'resenhas':listaResenhas, 'posts':listaPosts};
	
		res.render('inicial', {usuario:usuario, publi:listaPubli});
	});

	

	return router;
})();