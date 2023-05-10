const config = require("../modules/config");
const auth = require("../middlewares/auth");
const router = require("./router");
const multer = require('multer');
const fs = require('fs');
const comunidades = require("../modules/comunidades");
const { totalPosts } = require("../modules/comunidades");



var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null,'../frontend/imagens/fotosComunidade')
	},
	filename: function(req, file, cb) {
		cb(null, file.filename + '.jpg'); 
	}
})

var upload = multer({ storage: storage });

module.exports = ( function() {
    router.get('/comunidades', auth.verifyJWT, async function(req,res) {
        try {
			var usuario = await config.dbReturnUsername(req.userID);

		} catch {
			res.redirect('/sair');
			return router;
		}

		const comu = await comunidades.pegaComunidades();


		res.render('comunidades', {usuario:usuario, comu: comu});
	}),

	router.get('/comunidades/:comunidade', auth.verifyJWT, async function(req, res) {
		comu = req.params.comunidade;
		let validar = await config.dbValidateComunidade(comu);
        if (!validar) {
            res.status(404).send({status: 404, error: 'Comunidade não existente'})

            return router;
        }

		try {
			var usuario = await config.dbReturnUsername(req.userID);

		} catch {
			res.redirect('/sair');
			return router;
		}

		var idComu = await config.dbReturnComuID(comu);
		var cargo = await comunidades.pegaCargo(idComu, req.userID);

		var posts = await comunidades.pegaPosts(idComu);

		comu = await config.dbGetSingleRow("select c.nomeComunidade as nome, c.descComunidade as `desc`, c.imagemComunidade as img, count(*) as membros from comunidades c join membros m on c.idComunidade = m.idComunidade where c.idComunidade = ? group by c.idComunidade", [idComu]);

		var membros = await comunidades.ajeitaMembros(idComu);

		var total_Posts = await comunidades.totalPosts(idComu);

		res.render('comunidade', {comu:comu, usuario:usuario, posts:posts, total_Posts:total_Posts, membros:membros, cargo:cargo, idComu:idComu});

	})
	
	router.get('/criarComunidade', auth.verifyJWT, async function(req, res) {
		try {
			var usuario = await config.dbReturnUsername(req.userID);

		} catch {
			res.redirect('/sair');
			return router;
		}

		res.render('criarComunidade', {usuario: usuario});
	}),

	router.post('/criarComunidade', auth.verifyJWT, async function(req, res) {
		upload.single('foto')(req, res, async function (err) {
			try {
				fs.renameSync(req.file.path, req.file.path.replace('undefined', ((req.body.nome).split(' ').join('-'))));
				var img = `../imagens/fotosComunidade/${(req.body.nome).split(' ').join('-')}.jpg`;
			} catch {
				var img = `../imagens/comunidade.jpg`;
			}
			
			var userdata = req.body;

			var nomeComu = userdata.nome;
			var descComu = userdata.descricao;

			var idUsuario = req.userID;

			var idComunidade = config.numAleatorio();

			var dbRsp = await config.dbGetSingleValue("select count(*) as val from comunidades where idComunidade = ?", [idComunidade]);

			while (dbRsp > 0) {
				idComunidade = config.numAleatorio();

				dbRsp = await config.dbGetSingleValue("select count(*) as val from comunidades where idComunidade = ?", [idComunidade]);
			}

			await config.dbInsert("insert into comunidades values (?, ?, ?, ?)", [idComunidade, nomeComu, descComu, img]);

			await config.dbInsert("insert into membros values (null, ?, ?, 'adm')", [idUsuario, idComunidade]);
			res.redirect(`/comunidades`);
		});
	}),

	router.post('/criarPostComu/:nome', auth.verifyJWT, async function(req, res) {
		comu = req.params.nome;
		let validar = await config.dbValidateComunidade(comu);
        if (!validar) {
            res.status(404).send({status: 404, error: 'Comunidade não existente'})

            return router;
        }

		try {
			var usuario = await config.dbReturnUsername(req.userID);
			var id = req.userID;

		} catch {
			res.redirect('/sair');
			return router;
		}

		comuID = await config.dbReturnComuID(comu);

		post = req.body.comuPost;

		await config.dbInsert("insert into postComu values (null, ?, ?, ?)", [id, comuID, post]);

		res.redirect(`/comunidades/${comu}`);
	}),

	router.post('/participar/:nome', auth.verifyJWT, async function(req, res) {
		comu = req.params.nome;
		let validar = await config.dbValidateComunidade(comu);
        if (!validar) {
            res.status(404).send({status: 404, error: 'Comunidade não existente'})

            return router;
        }

		try {
			var usuario = await config.dbReturnUsername(req.userID);
			var id = req.userID;

		} catch {
			res.redirect('/sair');
			return router;
		}

		comuID = await config.dbReturnComuID(comu);

		await config.dbInsert("insert into membros values (null, ?, ?, ?)", [id, comuID, "membro"]);

		res.redirect(`/comunidades/${comu}`);
	}),

	router.post('/deixarComu/:nome', auth.verifyJWT, async function(req, res) {
		comu = req.params.nome;
		let validar = await config.dbValidateComunidade(comu);
        if (!validar) {
            res.status(404).send({status: 404, error: 'Comunidade não existente'})

            return router;
        }

		try {
			var usuario = await config.dbReturnUsername(req.userID);
			var id = req.userID;

		} catch {
			res.redirect('/sair');
			return router;
		}

		comuID = await config.dbReturnComuID(comu);

		await config.dbQuery("delete from membros where idUsuario = ? and idComunidade = ?", [id, comuID]);

		res.redirect(`/comunidades/${comu}`);
	})

	/*router.post('/editarComunidade/:comunidade', auth.verifyJWT, async function(req, res) {
		upload.single('foto')(req, res, async function (err) {
			try {
				fs.renameSync(req.file.path, req.file.path.replace('undefined', ((req.body.nome).split(' ').join('-'))));
				var img = `../imagens/fotosComunidade/${(req.body.nome).split(' ').join('-')}.jpg`;
			} catch {
				var img = `../imagens/comunidade.jpg`;
			}
			
			var userdata = req.body;

			var nomeComu = userdata.nome;
			var descComu = userdata.descricao;

			var idUsuario = req.userID;

			var idComunidade = config.numAleatorio();

			var dbRsp = await config.dbGetSingleValue("select count(*) as val from comunidades where idComunidade = ?", [idComunidade]);

			while (dbRsp > 0) {
				idComunidade = config.numAleatorio();

				dbRsp = await config.dbGetSingleValue("select count(*) as val from comunidades where idComunidade = ?", [idComunidade]);
			}

			await config.dbInsert("insert into comunidades values (?, ?, ?, ?)", [idComunidade, nomeComu, descComu, img]);

			await config.dbInsert("insert into membros values (null, ?, ?, 'adm')", [idUsuario, idComunidade]);
			res.redirect(`/comunidades`);
		});
	}),*/

    return router;
})();