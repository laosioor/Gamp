const config = require('./config');

module.exports = {
    pegaComunidades: async function() {
        var comunidades = await config.dbQuery("select c.nomeComunidade as nome, c.descComunidade as `desc`, c.imagemComunidade as img, count(*) as membros from comunidades c join membros m on c.idComunidade = m.idComunidade group by c.idComunidade order by membros desc");

        return comunidades;
    },

    pegaCargo: async function(idComu, idUsuario) {
        try {
            var cargo = await config.dbGetSingleRow("select m.cargo from membros m where m.idComunidade = ? and m.idUsuario = ?", [idComu, idUsuario]);
            return cargo["cargo"];
        } catch {
            var cargo = "null";
            return cargo;
        }
    },

    pegaPosts: async function(idComu) {
        var posts = await config.dbQuery("select (p.idPublicador) as usuario, u.imgUsuario, p.* from `postComu` p join usuarios u on u.idUsuario = p.idPublicador where idComunidade = ?", [idComu]);

        for(let i = 0; i < Object.keys(posts).length; i++) {
            posts[i].usuario = await config.dbReturnUsername(posts[i].usuario);
        }
        return posts;
    },

    totalPosts: async function(idComu) {
            var total = await config.dbGetSingleRow("select count(*) as totPost from postComu where idComunidade = ?", [idComu]);
    
            total = total["totPost"];
            switch(total) {
                case 1:
                    total = `${total} Publicação`;
                    break;
                default:
                    total = `${total} Publicações`;
                    break;
            }
            return total;
        },

    ajeitaMembros: async function(idComu) {
        var total = await config.dbGetSingleRow("select count(*) as membros from comunidades c join membros m on c.idComunidade = m.idComunidade where c.idComunidade = ?", [idComu]);
        total = total["membros"];
        switch(total) {
            case 1:
                total = `${total} Membro`;
                break;
            default:
                total = `${total} Membros`;
                break;
        }
        return total;
    }
}