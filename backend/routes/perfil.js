const config = require("../modules/config");
const router = require("./router");
const posts = require("../modules/posts");
const resenhas = require("../modules/resenhas");
const { perfilPosts } = require("../modules/posts");
const { perfilResenhas } = require("../modules/resenhas");
const auth = require("../middlewares/auth");
const publi = require("../modules/publi");
const multer = require('multer');
const fs = require('fs');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null,'../frontend/imagens/fotosPerfil')
	},
	filename: function(req, file, cb) {
		cb(null, file.filename + '.jpg'); 
	}
})

var upload = multer({ storage: storage });


module.exports = ( function() {
    router.get('/perfil/:usuario', auth.verifyJWT, async function(req,res) {
        try {
			var usuarioAtual = await config.dbReturnUsername(req.userID);

		} catch {
			res.redirect('/sair');
			return router;
		}

        var usuario = req.params.usuario;

        let validar = await config.dbValidateUsername(usuario);
        if (!validar) {
            res.status(404).send({status: 404, error: 'Usuario não encontrado'})

            return router;
        }

        var id = await config.dbReturnUserID(usuario);

        var bio = (await config.dbReturnUserInfo(id))["bioUsuario"];

        var ft = (await config.dbReturnUserInfo(id))["imgUsuario"];

        var segue = (await config.segue(id, req.userID));

        var perfil_posts = await posts.perfilPosts(id);
        var perfil_resenhas = await resenhas.perfilResenhas(id);
        var total_Publi = await publi.totalPubli(id);

        var totalSeguidores = await config.returnTotalSeguidores(id);
        var totalSeguindo = await config.returnTotalSeguindo(id);

        res.render('perfil', {usuario:usuario, bio:bio, ft:ft, usuarioAtual:usuarioAtual, perfil_posts:perfil_posts, perfil_resenhas:perfil_resenhas, total_Publi:total_Publi, segue:segue, totalSeguidores:totalSeguidores, totalSeguindo:totalSeguindo});
    }),

    router.get('/editarPerfil', auth.verifyJWT, async function(req, res) {
        try {
			var usuario = await config.dbReturnUsername(req.userID);

		} catch {
			res.redirect('/sair');
			return router;
		}

        var userinfo = await config.dbReturnUserInfo(req.userID);

        var nome = userinfo["nomeUsuario"];
        var bio = userinfo["bioUsuario"];
        var ft = userinfo["imgUsuario"];

        res.render('editarPerfil', {nome:nome, bio:bio, ft:ft});
    }),

    router.post('/editarPerfil', auth.verifyJWT, async function(req, res) {
        upload.single('foto')(req, res, async function (err) {
			try {
                fs.renameSync(req.file.path, req.file.path.replace('undefined', ((req.body.nome).split(' ').join('-'))));
                
                var img = `../imagens/fotosPerfil/${req.body.nome}.jpg`;
            } catch {
                var img = "../imagens/perfil.jpg";
            }

			var userdata = req.body;

			var nome = userdata.nome;
			var bio = userdata.bio;

			var id = req.userID;
            
            await config.dbQuery("update usuarios set nomeUsuario = ?, bioUsuario = ?, imgUsuario = ? where idUsuario = ?", [nome, bio, img, id]);
    

            res.redirect(`/perfil/${nome}`);
        }) 
    }),

    router.post('/seguir/:nome', auth.verifyJWT, async function(req, res) {
        try {
			var usuarioAtual = await config.dbReturnUsername(req.userID);
            var idAtual = req.userID;

		} catch {
			res.redirect('/sair');
			return router;
		}

        var usuario = req.params.nome;
        var id = await config.dbReturnUserID(usuario);

        let validar = await config.dbValidateUsername(usuario);
        if (!validar) {
            res.status(404).send({status: 404, error: 'Usuario não encontrado'})

            return router;
        }

		await config.dbInsert("insert into seguidores values (?, ?)", [idAtual, id]);

		res.redirect(`/perfil/${usuario}`);
    }),

    router.post('/deixarSeguir/:nome', auth.verifyJWT, async function(req, res) {
        try {
			var usuarioAtual = await config.dbReturnUsername(req.userID);
            var idAtual = req.userID;

		} catch {
			res.redirect('/sair');
			return router;
		}

        var usuario = req.params.nome;
        var id = await config.dbReturnUserID(usuario);

        let validar = await config.dbValidateUsername(usuario);
        if (!validar) {
            res.status(404).send({status: 404, error: 'Usuario não encontrado'})

            return router;
        }

		await config.dbQuery("delete from seguidores where idSeguidor = ? and idSeguindo = ?", [idAtual, id]);

		res.redirect(`/perfil/${usuario}`);
    })

    return router;
})();