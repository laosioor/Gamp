const config = require('./config');
const posts = require('./posts');

module.exports = {
    pegaResenhas: async function() {
        var resenhas = await config.dbQuery("select (r.idPublicador) as usuario, u.imgUsuario, r.* from resenhas r join usuarios u on u.idUsuario = r.idPublicador");

        for(let i = 0; i<Object.keys(resenhas).length; i++) {
            resenhas[i].usuario = await config.dbReturnUsername(resenhas[i].usuario);
        }
        return resenhas;
    },

    perfilResenhas: async function(id) {
        var resenhas = await config.dbQuery("select (r.idPublicador) as usuario, u.imgUsuario, r.* from resenhas r join usuarios u on u.idUsuario = r.idPublicador where r.idPublicador = ?", [id]);

        if (resenhas <= 0) {
            return false;
        }

        for(let i = 0; i<Object.keys(resenhas).length; i++) {
            resenhas[i].usuario = await config.dbReturnUsername(resenhas[i].usuario);
        }
        return resenhas;
    }
}