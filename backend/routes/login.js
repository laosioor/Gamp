const router = require('./router');
const config = require('../modules/config');
const jwt= require('jsonwebtoken');
const authConfig = require('../middlewares/auth.json');
const auth = require('../middlewares/auth.js');

module.exports = ( function() {
    router.get('/login', auth.verifyJWT, function(req, res) {
        res.render('login', {errors:[]});
    });

    router.post('/login', async function(req, res){
        var userdata = req.body;
        var errors = [];

        var email = userdata.email;
        var senha = userdata.senha;

        var con = config.getConn();

        var dbRsp = await config.dbGetSingleValue("select count(*) as val from usuarios where emailUsuario = ? and senhaUsuario = ?", [email, senha]);

        if (dbRsp === 0) {
            con.end();
            errors.push("Conta inexistente");

            console.log("Conta Inexistente");
            res.redirect('/login');

            return false
        }

        
        var userID = await config.dbGetSingleRow("select (idUsuario) from usuarios where emailUsuario = ?", [email]);
        
        var token = jwt.sign({user: userID}, authConfig.secret, { expiresIn: 84000} );

        res.cookie('token', 'Bearer ' + token, {
            httpOnly: true
        });

        res.redirect('/home');
    });
    
    return router;
})();