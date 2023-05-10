const router = require('./router');
const config = require('../modules/config');
const jwt= require('jsonwebtoken');
const authConfig = require('../middlewares/auth.json');
const auth = require('../middlewares/auth.js');

module.exports = ( function() {
    router.post('/registrar', async function(req, res) {
        var userdata = req.body;
        var errors = [];

        var nome = userdata.nome;
        var email = userdata.email;
        var senha = userdata.senha;

        var con = config.getConn();

        var dbRsp = await config.dbGetSingleValue("select count(*) as val from usuarios where emailUsuario = ?", [email]);

        if (dbRsp !== 0) {
            con.end();
            errors.push("Email já cadastrado");

            console.log("Email já cadastrado");
            res.redirect('/login');


            return false
        }

        var dbRsp = await config.dbGetSingleValue("select count(*) as val from usuarios where nomeUsuario = ?", [nome]);

        if (dbRsp !== 0) {
            con.end();
            errors.push("Usuário já existente");

            console.log("Usuário já existente");
            res.redirect('/login');

            return false
        }

        await config.dbInsert("insert into usuarios values (null, ?, ?, ?, '', '../imagens/perfil.jpg')", [nome, senha, email]);

        var userID = await config.dbGetSingleRow("select (idUsuario) from usuarios where nomeUsuario =?", [nome]);

        var token = jwt.sign({user: userID}, authConfig.secret, { expiresIn: 84000});

        res.cookie('token', 'Bearer ' + token, {
            httpOnly: true
        });

        res.redirect('/home');
    });

    return router;
})();