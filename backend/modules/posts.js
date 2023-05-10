const config = require('./config');

module.exports = {
    pegaPosts: async function() {
        var posts = await config.dbQuery("select (p.idPublicador) as usuario, u.imgUsuario, p.* from posts p join usuarios u on u.idUsuario = p.idPublicador");

        for(let i = 0; i < Object.keys(posts).length; i++) {
            posts[i].usuario = await config.dbReturnUsername(posts[i].usuario);
        }
        return posts;
    },

    perfilPosts: async function(id) {
        var posts = await config.dbQuery("select (p.idPublicador) as usuario, u.imgUsuario, p.* from posts p join usuarios u on u.idUsuario = p.idPublicador where idPublicador = ?",[id]);

        if (posts <= 0) {
            return false;
        }
        for(let i = 0; i < Object.keys(posts).length; i++) {
            posts[i].usuario = await config.dbReturnUsername(posts[i].usuario);
        }
        return posts;
    }
}