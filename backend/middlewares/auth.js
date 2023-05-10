const jwt = require('jsonwebtoken');
const authConfig = require('./auth.json');

module.exports = {
    verifyJWT: function(req, res, next) {
        const authCookie = req.cookies.token;
        if(!authCookie) {
            if ((req.route.path) === '/login' || (req.route.path) === '/') {
                return next();
            }

            res.clearCookie('token');
            return res.redirect('/login');
        }

        const parts = authCookie.split(' ');

        if(!parts.length === 2) {
            res.clearCookie('token');
            return res.redirect('/login');
        }

        const [ scheme, token ] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            res.clearCookie('token');
            return res.redirect('/login');
        }

        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) {
                res.clearCookie('token');
                return res.redirect('/login');
            }

            req.userID = decoded.user.idUsuario;
            if ((req.route.path) === '/login')/*|| (req.route.path) === '/'*/ {
                return res.redirect('/home');
            } 
            return next();
        });

        
    }
};